import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { useGetDiaryStreakQuery, useHasWeeklyReportQuery } from '@/entities/ai-report/api';
import { useWeeklyReportCheck } from '@/features/ai-report/hooks/useWeeklyReport';
import { getWeeklyCycleKey } from '@/shared/lib/day.util';
import { navigate } from '@/shared/lib/navigation.util';

const STORAGE_KEY = 'LAST_SHOWN_WEEKLY_REPORT_KEY';

export const useCheckWeeklyReportModal = () => {
  const { data: hasReport } = useHasWeeklyReportQuery();
  const { isBlocked } = useWeeklyReportCheck();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { isLoading: isReportLoading, isSuccess } = useGetDiaryStreakQuery();

  useEffect(() => {
    const checkStorageCondition = async () => {
      if (!hasReport || isBlocked) return;

      try {
        const currentKey = getWeeklyCycleKey();
        const lastKey = await AsyncStorage.getItem(STORAGE_KEY);

        if (lastKey !== currentKey) {
          setShouldNavigate(true);
        }
      } catch (e) {
        console.error('Failed to check weekly report modal:', e);
      }
    };

    checkStorageCondition();
  }, [hasReport, isBlocked]);

  useEffect(() => {
    if (shouldNavigate && !isReportLoading && isSuccess) {
      const currentKey = getWeeklyCycleKey();

      AsyncStorage.setItem(STORAGE_KEY, currentKey).then(() => {
        navigate('ReportResultPage');
        setShouldNavigate(false);
      });
    }
  }, [shouldNavigate, isReportLoading, isSuccess]);
};
