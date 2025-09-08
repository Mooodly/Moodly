import { Platform, type TextStyle } from 'react-native';

export const androidStyle: TextStyle =
  Platform.OS === 'android'
    ? {
        includeFontPadding: false,
        textAlignVertical: 'center',
        marginTop: -2,
      }
    : {};
