import { useScale } from '@/shared/hooks';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { androidStyle } from './Common';

type Props = TextProps & {
  weight?: 'regular' | 'semibold';
  size?: number;
};

export function Title({ children, weight = 'regular', size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 31);

  return (
    <Text
      style={[
        styles.base,
        weight === 'semibold' ? styles.semibold : styles.regular,
        { fontSize: fontSizeValue },
        androidStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#000000',
  },
  regular: {
    fontWeight: '400',
  },
  semibold: {
    fontWeight: '600',
  },
});
