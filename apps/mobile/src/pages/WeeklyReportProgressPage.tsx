import { StyleSheet, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { useGetDiaryStreakQuery } from '@/entities/ai-report/api';
import { WeeklyReportProgress } from '@/features/ai-report/ui/WeeklyReportProgress';
import { setModifyMode } from '@/features/diary/model/diarySlice';
import { dismissModalToScreen, navigate } from '@/shared/lib/navigation.util';
import { common } from '@/shared/styles/colors';

const WeeklyReportProgressPage = () => {
  const { data } = useGetDiaryStreakQuery();
  const dispatch = useAppDispatch();
  const isModifyMode = useAppSelector(state => state.diary.isModifyMode);
  const weeklyCount = data?.weeklyCount ?? 0;
  const dailyStatus = data?.dailyStatus ?? new Array(7).fill(false);

  const handleGoDetail = () => {
    if (isModifyMode) {
      dismissModalToScreen();
      dispatch(setModifyMode(false));
      return;
    }

    navigate('DiaryStack', {
      screen: 'EmotionDetailPage',
      params: { origin: 'DiaryStack' },
    });
  };

  return (
    <View style={styles.container}>
      <WeeklyReportProgress
        weeklyCount={weeklyCount}
        dailyStatus={dailyStatus}
        onConfirm={handleGoDetail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: common.white,
    flex: 1,
  },
});

export default WeeklyReportProgressPage;
