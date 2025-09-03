import { HOT_UPDATER_SUPABASE_URL } from '@env';
import { useLogout } from '@features/auth';
import { SETTING_EVENT_TYPE } from '@features/setting/types';
import { MODAL_CONFIRM_ACTION_KEY } from '@processes/key';
import {
  resetModalPopup,
  setRequestWithDrawal,
  setShowModalPopup,
  setShowToastView,
} from '@processes/overlay/model/overlaySlice';
import {
  Body1,
  common,
  gray,
  isEmpty,
  Label,
  resetTo,
  supabase,
  useAppDispatch,
  useAppSelector,
} from '@shared';
import { appApi } from '@shared/api/AppApi';
import NaviTitleDisplay from '@shared/ui/elements/NaviTitle';
import { NavigationBar } from '@widgets/navigation-bar';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import packageJson from '../../package.json';
import { useGetUserInfoQuery } from '../entities/auth/api/auth.api';
import { type BottomSheetHandler, SettingList } from '../features/setting';
import { ChangeNicknameSheet } from '../features/setting/ui/ChangeNicknameSheet';
import { SETTING_ICONS } from '../shared/assets/images/setting';

const ManageAccountPage = () => {
  const requestWithDrawal = useAppSelector(state => state.overlaySlice.requestWithDrawal);
  const { signOut } = useLogout();
  const dispatch = useAppDispatch();
  const { data: userInfo } = useGetUserInfoQuery();
  const changeNicknameSheetRef = useRef<BottomSheetHandler>(null);

  const handleAccountDeletion = useCallback(async () => {
    try {
      const user = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      if (!user.data.user) {
        return;
      }

      const res = await fetch(`${HOT_UPDATER_SUPABASE_URL}/functions/v1/smart-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({ userId: user.data.user.id }),
      });

      await res.json();
      if (res.ok) {
        await supabase.auth.signOut();
        dispatch(appApi.util.resetApiState());
        dispatch(setRequestWithDrawal(null));

        resetTo('Login');
      } else {
        dispatch(setShowToastView({ visibility: true, message: '회원 탈퇴 요청이 실패했어요.' }));
      }
    } catch (err) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err);
    } finally {
      dispatch(resetModalPopup());
    }
  }, [dispatch]);

  const handlePress = useCallback(
    (identifier: SETTING_EVENT_TYPE) => {
      if (identifier === SETTING_EVENT_TYPE.CHANGE_NICKNAME) {
        changeNicknameSheetRef.current?.expand();
      } else if (identifier === SETTING_EVENT_TYPE.LOG_OUT) {
        signOut();
      } else if (identifier === SETTING_EVENT_TYPE.DELETE_ACCOUNT) {
        dispatch(setRequestWithDrawal(null));
        dispatch(
          setShowModalPopup({
            visibility: true,
            title: '계정 삭제',
            message:
              '삭제 시 모든 기록 정보가 완전히 삭제되며,\n복구가 불가능합니다.\n\n정말 삭제하시겠어요?',
            cancelText: '취소',
            confirmText: '삭제',
            confirmActionKey: MODAL_CONFIRM_ACTION_KEY.WITHDRAWAL,
          }),
        );
      }
    },
    [signOut, dispatch],
  );

  useEffect(() => {
    if (isEmpty(requestWithDrawal)) {
      return;
    }
    handleAccountDeletion();
  }, [requestWithDrawal, handleAccountDeletion]);

  const settingListItems = useMemo(
    () => [
      [
        {
          key: 'change-nickname',
          title: '닉네임 변경',
          onPress: () => handlePress(SETTING_EVENT_TYPE.CHANGE_NICKNAME),
          rightComponent: (
            <View className="flex-row align-middle gap-2">
              <Body1
                weight="regular"
                style={styles.nickname}
              >
                {userInfo?.nickname}
              </Body1>
              <Image
                source={SETTING_ICONS.modifyNickname}
                className="w-6 h-6"
                accessibilityLabel="의견 보내기"
              />
            </View>
          ),
        },
      ],
      [
        {
          key: 'log-out',
          title: '로그아웃',
          onPress: () => handlePress(SETTING_EVENT_TYPE.LOG_OUT),
        },
        {
          key: 'delete-account',
          title: '회원 탈퇴',
          titleStyle: { color: common.red },
          onPress: () => handlePress(SETTING_EVENT_TYPE.DELETE_ACCOUNT),
        },
      ],
    ],
    [handlePress, userInfo?.nickname],
  );

  return (
    <>
      <NavigationBar
        backgroundColor={gray[100]}
        showBackButton={true}
        centerComponent={<NaviTitleDisplay title={'계정 관리'} />}
      />
      <View className="bg-gray-100 flex-1 justify-between px-4 rounded-xl pt-[14px]">
        <SettingList groups={settingListItems} />
        <Label
          weight="regular"
          className="text-gray-400 mb-[13px] text-center"
        >
          {'앱 버전: ' + packageJson.version}
        </Label>
      </View>
      <ChangeNicknameSheet ref={changeNicknameSheetRef} />
    </>
  );
};

const styles = StyleSheet.create({
  nickname: {
    color: gray[500],
  },
});

export default ManageAccountPage;
