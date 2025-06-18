import { combineReducers, configureStore } from '@reduxjs/toolkit';

import diarySlice from '@/features/diary/model/diary.slice';
import overlaySlice from '@/features/overlay/model/overlay.slice';
import progressSlice from '@/features/updateProgress/model/progress.slice';

const reducers = combineReducers({
  overlaySlice: overlaySlice,
  diarySlice: diarySlice,
  progressSlice: progressSlice,
});

export type RootState = ReturnType<typeof reducers>;
type RootAction = Parameters<typeof reducers>[1];

const rootReducer = (state: RootState | undefined, action: RootAction): RootState => {
  if (action.type === 'RESET_STORE') {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;

export default store;
