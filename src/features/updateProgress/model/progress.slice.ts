import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressState {
  progress: number;
}

const initialState: ProgressState = {
  progress: 0,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState: initialState,
  reducers: {
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
  },
});

export const { setProgress } = progressSlice.actions;

export default progressSlice.reducer;
