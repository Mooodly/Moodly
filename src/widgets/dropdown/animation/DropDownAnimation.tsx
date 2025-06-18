import { useCallback, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

import { setShowDropdownView } from '@/features/overlay/model/overlay.slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';

import DropDownContainer from '../ui/DropDownContainer';

const DropDownAnimation = () => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const showDropDownView = useAppSelector(state => state.overlaySlice.showDropDownView);
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    dispatch(
      setShowDropdownView({
        visibility: false,
        dropdownList: showDropDownView?.dropdownList ?? [],
        pos: { x: showDropDownView?.pos?.x ?? 0, y: showDropDownView?.pos?.y ?? 0 },
      })
    );
  }, [
    dispatch,
    showDropDownView?.dropdownList,
    showDropDownView?.pos?.x,
    showDropDownView?.pos?.y,
  ]);

  useEffect(() => {
    const toValue = showDropDownView?.visibility ? 1 : 0;
    Animated.timing(animationValue, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!showDropDownView?.visibility && finished) {
        dispatch(
          setShowDropdownView({
            visibility: null,
            dropdownList: null,
            pos: { x: null, y: null },
          })
        );
      }
    });
  }, [showDropDownView?.visibility, animationValue, dispatch]);

  return (
    <>
      <TouchableOpacity
        className="absolute inset-0 z-[998]"
        onPress={onClose}
      />
      <Animated.View
        className="absolute z-[998]"
        style={[
          {
            top: showDropDownView?.pos?.y ?? 0,
            left: (showDropDownView?.pos?.x ?? 0) - 120,
          },
          {
            opacity: animationValue,
            transform: [
              {
                translateY: animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <DropDownContainer />
      </Animated.View>
    </>
  );
};

export default DropDownAnimation;
