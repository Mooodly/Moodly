import { type DiaryCalendarModeType, type DiaryPageModeType } from '@entities/calendar/diary.type';
import { isNotEmpty } from '@shared/lib';
import { type Ref, useCallback } from 'react';
import { Dimensions, FlatList, type FlatListProps, type ListRenderItem, View } from 'react-native';

import type { CalendarPage } from '../lib/paging';
import EmotionDiaryMonthView from './EmotionDiaryMonthView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EmotionDiaryMonthPagerProps {
  data: CalendarPage[];
  diaryMode: DiaryPageModeType;
  calendarMode: DiaryCalendarModeType;
  flatListRef: Ref<FlatList<CalendarPage>>;
  onScroll?: FlatListProps<CalendarPage>['onScroll'];
  onMomentumScrollEnd?: FlatListProps<CalendarPage>['onMomentumScrollEnd'];
}

export const EmotionDiaryMonthPager = ({
  data,
  diaryMode,
  calendarMode,
  flatListRef,
  onScroll,
  onMomentumScrollEnd,
}: EmotionDiaryMonthPagerProps) => {
  const renderPage: ListRenderItem<CalendarPage> = useCallback(
    ({ item }) => {
      return (
        <View style={{ width: SCREEN_WIDTH }}>
          <EmotionDiaryMonthView
            monthDate={item.periodStart}
            monthData={item.items}
            diaryMode={diaryMode}
            scrollEnabled={isNotEmpty(item.items)}
            calendarMode={calendarMode}
          />
        </View>
      );
    },
    [calendarMode, diaryMode],
  );

  return (
    <FlatList<CalendarPage>
      ref={flatListRef}
      data={data}
      horizontal
      pagingEnabled
      keyExtractor={it => it.key}
      renderItem={renderPage}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      updateCellsBatchingPeriod={80}
      windowSize={3}
      getItemLayout={(_, i) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * i, index: i })}
      initialScrollIndex={1}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
    />
  );
};
