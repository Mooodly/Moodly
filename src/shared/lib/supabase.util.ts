import store from '@app/store';
import { HOT_UPDATER_SUPABASE_ANON_KEY, HOT_UPDATER_SUPABASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { appApi } from '../api/AppApi';
import { resetTo } from './navigation.util';

const nativeFetch = globalThis.fetch.bind(globalThis);
export const supabase = createClient(HOT_UPDATER_SUPABASE_URL, HOT_UPDATER_SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: async (input: string | URL | Request, init?: RequestInit) => {
      const maxAttempts = 3;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await nativeFetch(input, init);
          const errorCode = res.headers.get('x-sb-error-code');
          if (res.status === 403 && errorCode === 'user_not_found') {
            console.log('삭제된 유저');
            return res;
          }
          if (res.status === 401 || res.status === 403) {
            store.dispatch(appApi.util.resetApiState());
            resetTo('Login');
            throw new Error('인증이 만료되었습니다. 다시 로그인하세요.');
          }
          return res;
        } catch (e: unknown) {
          lastError = e instanceof Error ? e : new Error(String(e));

          if (attempt === maxAttempts) {
            throw new Error(`네트워크 요청에 실패했습니다: ${lastError.message}`);
          }
          // 재시도 전 1초 대기
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      throw lastError!;
    },
  },
});
