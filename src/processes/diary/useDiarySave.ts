// useDiarySave.ts

import {
  addDiaryThunk,
  modifyDiaryThunk,
  setSelectedDiary,
} from '@/features/diary/model/diary.slice';
import { useAppDispatch, useAppSelector, useRealm } from '@/shared/hooks';
import { isNotEmpty, navigate } from '@/shared/lib';

export function useDiarySave(text: string) {
  const dispatch = useAppDispatch();
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const { openRealm, closeRealm } = useRealm();

  const save = async () => {
    const realm = await openRealm();
    if (!isNotEmpty(text) || !isNotEmpty(realm)) return;

    const diary = { ...todayDiary, description: text };
    const thunk = isNotEmpty(selectedDiary)
      ? modifyDiaryThunk({ realm, emotionId: selectedDiary.emotionId ?? -1, data: diary })
      : addDiaryThunk({ realm, data: diary });

    const result = await dispatch(thunk);
    diary.emotionId = result.payload as number;
    await closeRealm();
    dispatch(setSelectedDiary(diary));
    navigate('DiaryStack', { screen: 'Complete' });
  };

  return save;
}
