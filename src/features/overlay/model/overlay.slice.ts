import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DropDownItemProps } from '@/widgets/dropdown/ui/DropDownItem';

interface DropdownViewPayload {
  visibility?: boolean | null;
  dropdownList: DropDownItemProps[] | null;
  pos: { x: number | null; y: number | null };
}

interface ToastViewPayload {
  visibility?: boolean | null;
  message: string;
}

interface ModalViewPayload {
  visibility?: boolean | null;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  confirmActionKey: string;
}

interface OverlayState {
  showModalPopup?: ModalViewPayload;
  showDropDownView?: DropdownViewPayload;
  showToastView?: ToastViewPayload;
  overlayEventHandler: string | null;
}

const initialState: OverlayState = {
  showModalPopup: { visibility: null, title: '', message: '', confirmActionKey: '' },
  showDropDownView: { visibility: false, dropdownList: null, pos: { x: null, y: null } },
  showToastView: { visibility: null, message: '' },
  overlayEventHandler: null,
};

const overlaySlice = createSlice({
  name: 'overlay',
  initialState: initialState,
  reducers: {
    setShowModalPopup: (state, action: PayloadAction<ModalViewPayload>) => {
      state.showModalPopup = action.payload;
    },
    setShowDropdownView: (state, action: PayloadAction<DropdownViewPayload>) => {
      state.showDropDownView = action.payload;
    },
    setShowToastView: (state, action: PayloadAction<ToastViewPayload>) => {
      state.showToastView = action.payload;
    },
    setOverlayEventHandler: (state, action: PayloadAction<string | null>) => {
      state.overlayEventHandler = action.payload;
    },
  },
});

export const { setShowModalPopup, setShowDropdownView, setShowToastView, setOverlayEventHandler } =
  overlaySlice.actions;

export default overlaySlice.reducer;
