import { DiaryCalendarMode, DiaryPageMode } from '@entities/calendar/diary.type';
import { selectCalendarMode } from '@features/calendar';
import type { CalendarPage } from '@features/calendar/lib/paging';
import { useDiaryPagerVM } from '@features/calendar/model/useDiaryPagerVM';
import { usePagerController } from '@features/calendar/model/usePagerController';
import { EmotionDiaryMonthPager } from '@features/calendar/ui/EmotionDiaryMonthPager';
import { setCalendarMode } from '@features/diary';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector';
import { useAppDispatch, useAppSelector } from '@shared';
import { DIARY_ICONS } from '@shared/assets/images/diary';
import colors from '@shared/styles/colors';
import DiaryToggle from '@shared/ui/elements/DiaryToggle';
import { NavigationBar } from '@widgets/navigation-bar';
import { useCallback, useEffect, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export const DiaryPager = () => {
  const { diaryMode, pages, monthLabel, goLeft, goRight, toggleDiaryMode, reset } =
    useDiaryPagerVM();
  const calendarMode = useAppSelector(selectCalendarMode);
  const dispatch = useAppDispatch();
  const { flatListRef, onScroll, onMomentumScrollEnd, scrollToMiddle } =
    usePagerController<CalendarPage>({
      onLeft: goLeft,
      onRight: goRight,
    });

  useEffect(() => {
    scrollToMiddle(false);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftComponents = useMemo(
    () => [
      {
        item: (
          <EmotionDiaryMonthSelector
            monthLabel={monthLabel}
            onPressLeft={goLeft}
            onPressRight={goRight}
          />
        ),
        disabled: true,
      },
    ],
    [goLeft, goRight, monthLabel],
  );

  const toggleCalendarMode = useCallback(() => {
    const nextMode =
      calendarMode === DiaryCalendarMode.monthDayMode
        ? DiaryCalendarMode.weekDayMode
        : DiaryCalendarMode.monthDayMode;

    dispatch(setCalendarMode(nextMode));
  }, [calendarMode, dispatch]);

  const actionButtons = useMemo(
    () => [
      ...(diaryMode === DiaryPageMode.calendarMode
        ? [
            {
              item: (
                <DiaryToggle
                  isOn={calendarMode === DiaryCalendarMode.monthDayMode}
                  texts={['주간', '월간']}
                  onToggle={toggleCalendarMode}
                />
              ),
              disabled: true,
            },
          ]
        : []),
      {
        item: (
          <TouchableOpacity
            onPress={toggleDiaryMode}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={
                diaryMode === DiaryPageMode.calendarMode
                  ? DIARY_ICONS.iconDiaryCalendar
                  : DIARY_ICONS.iconDiaryList
              }
              className="w-6 h-6"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        ),
      },
    ],
    [calendarMode, diaryMode, toggleCalendarMode, toggleDiaryMode],
  );

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        leftComponents={leftComponents}
        actionButtons={actionButtons}
      />
      <View style={styles.container}>
        <EmotionDiaryMonthPager
          data={pages}
          diaryMode={diaryMode}
          calendarMode={calendarMode}
          flatListRef={flatListRef}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
