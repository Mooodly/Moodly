import { Text, type TextProps } from 'react-native';

import { useScale } from '@/shared/hooks';

import { androidStyle } from './Common';

type Props = TextProps & { weight: 'regular' | 'semibold'; size?: number };
export function H2({ children, weight, size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 20);
  const className = `text-h2 font-${weight} text-center`;
  return (
    <Text
      className={className}
      style={[{ fontSize: fontSizeValue }, androidStyle, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
