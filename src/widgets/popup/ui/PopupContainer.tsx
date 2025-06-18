import React, { useEffect, useRef } from 'react';
import { Animated, Modal, View } from 'react-native';

import { setShowModalPopup } from '@/features/overlay/model/overlay.slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import DimmedView from '@/shared/ui/elements/DimmedView';

import PopupFooter from './PopupFooter';
import PopupHeader from './PopupHeader';

interface PopupContainerProps {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
}

const PopupContainer = ({ ...props }: PopupContainerProps) => {
  const showModalPopup = useAppSelector(state => state.overlaySlice.showModalPopup);
  const dispatch = useAppDispatch();

  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isVisible = Boolean(showModalPopup?.visibility);
    const toValueY = isVisible ? 0 : 30;
    const toValueOpacity = isVisible ? 1 : 0;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: toValueY,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: toValueOpacity,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && !isVisible) {
        dispatch(
          setShowModalPopup({
            visibility: null,
            title: '',
            message: '',
            confirmActionKey: '',
          })
        );
      }
    });
  }, [showModalPopup?.visibility, dispatch, opacity, translateY]);

  const handleCloseModal = () => {
    dispatch(
      setShowModalPopup({
        visibility: false,
        title: showModalPopup?.title ?? '',
        message: showModalPopup?.message ?? '',
        confirmText: showModalPopup?.confirmText,
        cancelText: showModalPopup?.cancelText,
        confirmActionKey: showModalPopup?.confirmActionKey ?? '',
      })
    );
  };

  return (
    <Modal
      transparent
      visible
      onRequestClose={handleCloseModal}
      animationType="fade"
    >
      <DimmedView onPress={handleCloseModal}>
        <Animated.View
          style={{ transform: [{ translateY }], opacity: opacity }}
          className="flex-1 justify-center p-10"
        >
          <View className="w-full bg-common-white rounded-xl items-center">
            <PopupHeader
              title={props.title}
              message={props.message}
            />
            <PopupFooter
              onCancel={handleCloseModal}
              onConfirm={props.onConfirm}
              cancelText={props.cancelText}
              confirmText={props.confirmText}
            />
          </View>
        </Animated.View>
      </DimmedView>
    </Modal>
  );
};

export default React.memo(PopupContainer);
