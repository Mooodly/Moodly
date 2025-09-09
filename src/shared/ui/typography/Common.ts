import { Platform, type TextStyle } from 'react-native';

export const androidStyle: TextStyle =
  Platform.OS === 'android'
    ? {
        marginTop: -2,
      }
    : {};
