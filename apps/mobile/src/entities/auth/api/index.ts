import { GoogleSignin, statusCodes, type User } from '@react-native-google-signin/google-signin';
import dayjs from 'dayjs';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

import { appApi } from '@/shared/api/appApi';
import { requireUser, withAuth } from '@/shared/api/authGuard';
import { API_CODE } from '@/shared/api/error/apiCode';
import { isIphone } from '@/shared/lib/user.util';

import type { SetUserInfoInput, SignInProviderInput, SignInResult, UserInfo } from '../model/types';

GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID! });

async function getDeviceId(): Promise<string> {
  if (isIphone()) {
    const id = await Application.getIosIdForVendorAsync();
    return id ?? 'unknown-ios-device';
  }
  const id = Application.getAndroidId();
  return id ?? 'unknown-android-device';
}

export async function getGoogleToken() {
  console.log('[GoogleAuth] 1. getGoogleToken 함수 진입');

  try {
    console.log('[GoogleAuth] 2. PlayServices 확인 중...');
    await GoogleSignin.hasPlayServices();
    console.log('[GoogleAuth] 3. PlayServices 확인 완료. 로그인 시도...');

    const userInfo = await GoogleSignin.signIn();
    console.log('[GoogleAuth] 4. 로그인 성공. User Info:', JSON.stringify(userInfo, null, 2));

    console.log('[GoogleAuth] 5. 토큰 요청 중...');
    const tokens = await GoogleSignin.getTokens();
    console.log('[GoogleAuth] 6. 토큰 수신 완료. Tokens:', JSON.stringify(tokens, null, 2));

    const { idToken: token } = tokens;

    if (!token) {
      console.error('[GoogleAuth] Error: idToken이 비어 있습니다.');
      throw { code: API_CODE.UNKNOWN, message: 'Google 토큰을 가져오지 못했습니다.' };
    }

    console.log('[GoogleAuth] 7. 최종 토큰 반환 성공');
    return { token };
  } catch (e: any) {
    const c = e?.code;
    console.error('[GoogleAuth] Exception 발생:', {
      code: c,
      message: e?.message,
      fullError: e,
    });

    if (c === statusCodes.SIGN_IN_CANCELLED || /CANCE?LLED/i.test(String(c))) {
      console.warn('[GoogleAuth] 사용자가 로그인을 취소함');
      throw { code: API_CODE.LOGIN_CANCELLED, message: '로그인을 취소했어요.' };
    }

    if (c === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.error('[GoogleAuth] Play Services 사용 불가');
      throw {
        code: API_CODE.BAD_REQUEST,
        message: 'Google Play 서비스가 필요합니다.',
        status: 400,
      };
    }

    console.error('[GoogleAuth] 처리되지 않은 예외, 상위로 전파');
    throw e;
  }
}

export async function getAppleToken() {
  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw {
      code: API_CODE.BAD_REQUEST,
      message: '이 기기에서는 Apple 로그인이 지원되지 않습니다.',
      status: 400,
    };
  }
  try {
    const resp = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
    });
    if (!resp.identityToken) {
      throw { code: API_CODE.NOT_FOUND, message: 'Apple 로그인 요청이 실패했어요.', status: 404 };
    }
    return { token: resp.identityToken, nonce: null };
  } catch (e: any) {
    if (e?.code === 'ERR_REQUEST_CANCELED') {
      throw { code: API_CODE.LOGIN_CANCELLED, message: '로그인을 취소했어요.' };
    }
    throw e;
  }
}

export const authApi = appApi.injectEndpoints({
  endpoints: build => ({
    signInWithProvider: build.mutation<SignInResult, SignInProviderInput>({
      query:
        ({ provider }) =>
        async client => {
          const getToken = provider === 'google' ? getGoogleToken : getAppleToken;
          const { token, nonce } = (await getToken()) as { token: string; nonce?: string | null };

          const { data, error } = await client.auth.signInWithIdToken({
            provider,
            token,
            ...(nonce ? { nonce } : {}),
          });
          if (error || !data?.user) {
            throw {
              ...error,
              code: API_CODE.SERVER_ERROR,
              message: error?.message ?? '로그인에 실패했습니다.',
            };
          }

          const c = dayjs(data.user.created_at);
          const l = dayjs(data.user.last_sign_in_at);
          const isNewUser = l.diff(c) < 5000;

          return { user: data.user, isNewUser, provider };
        },
      invalidatesTags: ['User', 'Session'],
    }),

    signOut: build.mutation<boolean, void>({
      query: () => async client => {
        const { error } = await client.auth.signOut();
        if (error) throw { ...error, code: API_CODE.SERVER_ERROR };
        return true;
      },
      invalidatesTags: ['User', 'Session'],
    }),

    fetchSession: build.query<User | null, void>({
      query: () => async client => {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        return data?.session?.user ?? null;
      },
      extraOptions: { silentError: true },
      providesTags: r =>
        r
          ? [
              { type: 'Session', id: 'CURRENT' },
              { type: 'User', id: 'ME' },
            ]
          : [],
    }),

    getUserInfo: build.query<UserInfo, void>({
      query: () => async client => {
        const user = await requireUser(client);
        const { data, error } = await client
          .from('tb_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        return data as UserInfo;
      },
      providesTags: r => (r ? [{ type: 'User', id: 'ME' }] : []),
    }),

    setUserInfo: build.mutation<boolean, SetUserInfoInput>({
      query: payload =>
        withAuth(async (client, user) => {
          const { error } = await client.from('tb_profiles').upsert({
            id: user.id,
            nickname: payload.nickname,
            email: user.email,
          });
          if (error) throw error;
          return true;
        }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),

    upsertPushToken: build.mutation<boolean, { token: string }>({
      query: ({ token }) =>
        withAuth(async (client, user) => {
          const deviceId = await getDeviceId();
          const { error } = await client.from('push_tokens').upsert({
            user_id: user.id,
            device_id: deviceId,
            token,
            platform: Platform.OS,
            last_seen_at: new Date().toISOString(),
          });
          if (error) throw error;
          return true;
        }),
    }),

    deletePushToken: build.mutation<boolean, void>({
      query: () =>
        withAuth(async (client, user) => {
          const deviceId = await getDeviceId();
          const { error } = await client
            .from('push_tokens')
            .delete()
            .match({ user_id: user.id, device_id: deviceId });
          if (error) throw error;
          return true;
        }),
    }),
  }),
});

export const {
  useSignInWithProviderMutation,
  useSignOutMutation,
  useFetchSessionQuery,
  useLazyFetchSessionQuery,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useSetUserInfoMutation,
  useUpsertPushTokenMutation,
  useDeletePushTokenMutation,
} = authApi;
