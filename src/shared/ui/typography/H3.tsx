import { Text, type TextProps } from 'react-native';

import { getScaleSize } from '@/shared/hooks';

import { androidStyle } from './Common';

type Props = TextProps & { weight: 'regular' | 'semibold'; size?: number };

export function H3({ children, weight, size, style, ...rest }: Props) {
  const className = `text-h3 font-${weight}`;
  const fontSizeValue = getScaleSize(size ?? 18);
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
