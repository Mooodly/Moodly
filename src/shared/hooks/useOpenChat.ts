import { useCallback } from 'react';
import { Linking } from 'react-native';

import { setShowToastView } from '@/features/overlay/model/overlay.slice';

import { useAppDispatch } from './useHooks';

type useOpenChat = {
  openChat: (chatUrl: string) => Promise<void>;
};

export function useOpenKakao(): useOpenChat {
  const dispatch = useAppDispatch();
  const openChat = useCallback(
    async (chatUrl: string) => {
      try {
        const supported = await Linking.canOpenURL(chatUrl);
        if (!supported) {
          dispatch(
            setShowToastView({
              visibility: true,
              message: '해당 링크를 열 수 없습니다.',
            })
          );
          return;
        }
        await Linking.openURL(chatUrl);
      } catch (err) {
        console.error('오픈채팅 연결 실패:', err);
        dispatch(
          setShowToastView({
            visibility: true,
            message: '오픈채팅 연결 중 오류가 발생했습니다.',
          })
        );
      }
    },
    [dispatch]
  );

  return { openChat };
}
