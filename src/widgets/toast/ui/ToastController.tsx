import { shallowEqual } from 'react-redux';

import { setShowToastView } from '@/features/overlay/model/overlay.slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';

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
