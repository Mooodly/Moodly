import { shallowEqual } from 'react-redux';

import { useAppDispatch, useAppSelector } from '@/shared/hooks';

import { setShowToastView } from '@/features/overlay/model/overlay.slice';
import ToastAnimated from '../animation/ToastAnimated';

const ToastController = () => {
  const dispatch = useAppDispatch();
  const showToastView = useAppSelector(state => state.overlaySlice.showToastView, shallowEqual);

  return (
    <ToastAnimated
      visible={showToastView?.visibility ?? false}
      text={showToastView?.message ?? ''}
      onHide={() => dispatch(setShowToastView({ visibility: null, message: '' }))}
    />
  );
};

export default ToastController;
