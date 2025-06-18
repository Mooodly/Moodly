import { setOverlayEventHandler } from '@/features/overlay/model/overlay.slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { isNotEmpty } from '@/shared/lib';
import DropDownAnimation from '@/widgets/dropdown/animation/DropDownAnimation';
import PopupContainerOrga from '@/widgets/popup/ui/PopupContainer';
import ToastController from '@/widgets/toast/ui/ToastController';

import { MODAL_CONFIRM_ACTION_KEY } from '../../key';

const OverlayManager = () => {
  const showToastView = useAppSelector(state => state.overlaySlice.showToastView);
  const showModalPopup = useAppSelector(state => state.overlaySlice.showModalPopup);
  const showDropDownView = useAppSelector(state => state.overlaySlice.showDropDownView);
  const dispatch = useAppDispatch();

  return (
    <>
      {isNotEmpty(showToastView?.visibility) && <ToastController />}

      {isNotEmpty(showModalPopup?.visibility) && (
        <PopupContainerOrga
          title={showModalPopup?.title ?? ''}
          message={showModalPopup?.message ?? ''}
          cancelText={showModalPopup?.cancelText ?? ''}
          confirmText={showModalPopup?.confirmText ?? ''}
          onConfirm={() => {
            if (showModalPopup?.confirmActionKey === MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY) {
              dispatch(setOverlayEventHandler(MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY));
            }
          }}
        />
      )}

      {isNotEmpty(showDropDownView?.visibility) && <DropDownAnimation />}
    </>
  );
};

export default OverlayManager;
