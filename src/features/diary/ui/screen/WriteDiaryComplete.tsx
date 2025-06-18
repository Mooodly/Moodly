import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { setShowToastView } from '@/features/overlay/model/overlay.slice';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize, useAppDispatch, useAppSelector } from '@/shared/hooks';
import { dismissModalToScreen, navigate } from '@/shared/lib';
import { gray } from '@/shared/styles/colors';
import { Body2 } from '@/shared/ui/typography/Body2';
import { H2 } from '@/shared/ui/typography/H2';

import { setModifyMode } from '../../model/diary.slice';

const WriteDiaryComplete = () => {
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const dispatch = useAppDispatch();
  const initialModifyMode = useRef(isModifyMode);

  useEffect(() => {
    if (initialModifyMode.current) {
      dispatch(setShowToastView({ visibility: true, message: '일기가 수정되었어요.' }));
    }

    const timer = setTimeout(() => {
      if (initialModifyMode.current) {
        dismissModalToScreen();
        dispatch(setModifyMode(false));
      } else {
        navigate('DiaryStack', { screen: 'DiaryDetail', params: { origin: 'DiaryStack' } });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <View className="flex-1 bg-common-white items-center justify-center">
      <Image
        source={MAIN_ICONS.avatarComplete}
        style={styles.avatarStyle}
      />
      <H2
        weight="semibold"
        style={styles.mentStyle}
      >
        일기 작성 완료
      </H2>
      <Body2
        weight="regular"
        style={styles.bodyStyle}
      >
        솔직한 마음을 들려줘서 고마워요
      </Body2>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarStyle: {
    height: getScaleSize(120),
    width: getScaleSize(120),
  },
  bodyStyle: {
    color: gray[400],
    marginTop: getScaleSize(8),
  },
  mentStyle: {
    color: gray[600],
    marginTop: getScaleSize(8),
  },
});

export default WriteDiaryComplete;
