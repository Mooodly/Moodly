import { type DiaryCalendarModeType, type DiaryPageModeType } from '@entities/calendar/diary.type';
import type { Diary } from '@entities/diary/model/diary.types';
import EmotionDiaryCardList from '@features/diary/ui/EmotionDiaryCardList';
import EmotionDiaryListEmpty from '@features/diary/ui/EmotionDiaryListEmpty';
import EmotionDiaryListHeader from '@features/diary/ui/EmotionDiaryListHeader';
import { useAppSelector, useDelay } from '@shared';
import { isEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import DiarySkeleton from '../../diary/ui/skeleton/DiaryCardSkeleton';
import { selectIsDiaryPagingLoading, selectSelectedDayIso } from '../model';

type DiaryListItem = { type: 'DIARY'; data: Diary };
type SkeletonListItem = { type: 'SKELETON'; id: number };
type ListItem = DiaryListItem | SkeletonListItem;

interface EmotionDiaryMonthViewProps {
  monthDate: Dayjs;
  monthData: Diary[];
  diaryMode: DiaryPageModeType;
  scrollEnabled: boolean;
  showSkeleton?: boolean;
  calendarMode?: DiaryCalendarModeType;
}

const EmotionDiaryMonthView = ({
  monthDate,
  monthData,
  diaryMode,
  scrollEnabled,
  showSkeleton,
  calendarMode,
}: EmotionDiaryMonthViewProps) => {
  const isDiaryLoading = useAppSelector(selectIsDiaryPagingLoading);
  const isDelayedLoading = useDelay(isDiaryLoading);
  const selectedDayIso = useAppSelector(selectSelectedDayIso);

  const SKELETON_DATA: SkeletonListItem[] = useMemo(
    () => Array.from({ length: 4 }, (_, i) => ({ type: 'SKELETON', id: i })),
    [],
  );

  const realData: Diary[] = useMemo(() => {
    if (!selectedDayIso) {
      return monthData;
    }
    return monthData.filter(e => dayjs(e.recordDate).isSame(dayjs(selectedDayIso), 'day'));
  }, [monthData, selectedDayIso]);

  const listData: ListItem[] = isDelayedLoading
    ? SKELETON_DATA
    : realData.map(diary => ({ type: 'DIARY', data: diary }));

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    switch (item.type) {
      case 'DIARY':
        return <EmotionDiaryCardList data={item.data} />;
      case 'SKELETON':
        return <DiarySkeleton />;
      default:
        return null;
    }
  }, []);

  const keyExtractor = useCallback((item: ListItem) => {
    switch (item.type) {
      case 'DIARY':
        return item.data.emotionId?.toString() ?? item.data.recordDate;
      case 'SKELETON':
        return `skeleton-${item.id}`;
      default:
        return `unknown-${item}`;
    }
  }, []);
  return (
    <View style={styles.page}>
      <FlatList<ListItem>
        style={styles.list}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={!isDelayedLoading && scrollEnabled}
        contentContainerStyle={[
          styles.scrollViewContent,
          !isDelayedLoading && isEmpty(realData) && styles.emptyContainer,
        ]}
        ListHeaderComponent={
          diaryMode === 'CALENDARMODE' ? (
            <EmotionDiaryListHeader
              showSkeleton={showSkeleton ?? false}
              diaryMode={diaryMode}
              selectedMonth={monthDate.toString()}
              monthData={monthData}
              calendarMode={calendarMode}
            />
          ) : null
        }
        ListEmptyComponent={isDelayedLoading ? null : <EmotionDiaryListEmpty />}
        initialNumToRender={listData.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  page: {
    backgroundColor: colors.gray[100],
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    padding: 16,
  },
});

export default memo(EmotionDiaryMonthView);
