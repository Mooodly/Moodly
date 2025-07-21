import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isNotEmpty, resetTo } from '@shared/lib';
import { KeyboardAccessoryButton } from '@shared/ui/elements/KeyboardAccessory';
import { useEffect } from 'react';
import { useDiaryMutation } from '../hooks/useDiaryMutation';
import { setSelectedDiary } from '../model/diary.slice';

export function DiarySaveButton(text: string) {
  const dispatch = useAppDispatch();
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const { save, isLoading, result } = useDiaryMutation(text);

  useEffect(() => {
    if (isNotEmpty(result)) {
      const diary = {
        ...todayDiary,
        description: text,
        emotionId: result,
      };
      dispatch(setSelectedDiary(diary));
      resetTo('DiaryStack', { screen: 'Complete' });
    }
  }, [result, dispatch, text, todayDiary]);

  return <KeyboardAccessoryButton onPress={save} />;
}
