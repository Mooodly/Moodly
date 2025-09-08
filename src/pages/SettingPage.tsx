import { useGetUserInfoQuery } from '@entities/auth/api/auth.api';
import { KAKAO_OPEN_CHAT_LINK, PRIVACY_POLICY_LINK, TERMS_OF_SERVICE_LINK } from '@env';
import { useLogout } from '@features/auth';
import { SettingRoot } from '@features/setting';
import { SETTING_EVENT_TYPE, TEXTS } from '@features/setting/types';
import { MODAL_CONFIRM_ACTION_KEY } from '@processes/key';
import { setShowModalPopup } from '@processes/overlay/model/overlaySlice';
import {
  Body1,
  gray,
  isNotEmpty,
  Label,
  navigate,
  Toggle,
  useAppDispatch,
  useDelay,
  useExternalWebSite,
} from '@shared';
import { COMMON_ICONS } from '@shared/assets/images/common';
import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { checkNotifications } from 'react-native-permissions';

const SettingPage = () => {
  const { openLink } = useExternalWebSite();
  const { signOut } = useLogout();
  const dispatch = useAppDispatch();
  const { data: userInfo, isLoading } = useGetUserInfoQuery();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkApi = async () => {
      const response = await checkNotifications();
      setStatus(response.status);
    };
    checkApi();
  }, []);

  const handlePress = useCallback(
    (type: SETTING_EVENT_TYPE) => {
      switch (type) {
        case SETTING_EVENT_TYPE.MANAGE_ACCOUNT:
          navigate('Main', {
            screen: 'SettingStack',
            params: { screen: 'ManageAccount' },
          });
          break;
        case SETTING_EVENT_TYPE.SEND_FEEDBACK:
          openLink(KAKAO_OPEN_CHAT_LINK);
          break;
        case SETTING_EVENT_TYPE.LOG_OUT:
          signOut();
          break;
        case SETTING_EVENT_TYPE.PRIVACY_POLICY:
          openLink(PRIVACY_POLICY_LINK);
          break;
        case SETTING_EVENT_TYPE.TERMS_OF_SERVICE:
          openLink(TERMS_OF_SERVICE_LINK);
          break;
        default:
          break;
      }
    },
    [openLink, signOut],
  );

  const headerItem = isNotEmpty(userInfo)
    ? {
        leftComponent: (
          <TouchableOpacity
            onPress={() => {
              handlePress(SETTING_EVENT_TYPE.MANAGE_ACCOUNT);
            }}
          >
            <View className="flex-row justify-between">
              <View className="flex-col gap-2">
                <Body1
                  weight="semibold"
                  style={styles.text}
                >
                  {userInfo.nickname}
                </Body1>
                <Label
                  weight="regular"
                  style={styles.text}
                >
                  {userInfo.email}
                </Label>
              </View>
              <Image
                source={COMMON_ICONS.iconNextGray}
                className="w-6 h-6"
                accessibilityLabel="의견 보내기"
              />
            </View>
          </TouchableOpacity>
        ),
      }
    : {
        leftComponent: <></>,
      };

  const settingListItems = [
    [
      {
        title: TEXTS.notificationSettings,
        rightComponent: (
          <Toggle
            isOn={status === 'granted'}
            onToggle={() =>
              dispatch(
                setShowModalPopup({
                  visibility: true,
                  title: '알림 설정 변경',
                  message: '알림을 변경하려면 설정 앱으로 이동해 주세요',
                  cancelText: '나중에 하기',
                  confirmText: '설정하기',
                  confirmActionKey: MODAL_CONFIRM_ACTION_KEY.PERMISSION_CHANGE,
                }),
              )
            }
          />
        ),
      },
    ],
    [
      {
        title: TEXTS.feedback,
        onPress: () => handlePress(SETTING_EVENT_TYPE.SEND_FEEDBACK),
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            className="w-6 h-6"
            accessibilityLabel="의견 보내기"
          />
        ),
      },
    ],
    [
      {
        title: TEXTS.privacyPolicy,
        onPress: () => handlePress(SETTING_EVENT_TYPE.PRIVACY_POLICY),
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            className="w-6 h-6"
            accessibilityLabel="개인정보 처리방침"
          />
        ),
      },
      {
        title: TEXTS.termsOfService,
        onPress: () => handlePress(SETTING_EVENT_TYPE.TERMS_OF_SERVICE),
        rightComponent: (
          <Image
            source={COMMON_ICONS.iconNextGray}
            className="w-6 h-6"
            accessibilityLabel="이용약관"
          />
        ),
      },
    ],
  ];

  return (
    <>
      <SettingRoot
        headerItem={headerItem}
        settingItems={settingListItems}
        isLoading={useDelay(isLoading) ?? false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: gray[500],
  },
});

export default SettingPage;
