import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { getScaleSize } from '@/shared/hooks/useScale';
import { isIphone } from '@/shared/lib/user.util';
import { gray } from '@/shared/styles/colors';
import { H3 } from '@/shared/ui/typography/H3';

interface KeyboardAccessoryButtonProps {
  onPress: () => void;
}

export const KeyboardAccessoryButton = ({ onPress }: KeyboardAccessoryButtonProps) => (
  <View style={[styles.container, { height: isIphone() ? 40 : 90 }]}>
    <TouchableWithoutFeedback onPress={onPress}>
      <H3
        weight="semibold"
        style={[styles.text, { marginBottom: isIphone() ? 0 : 15 }]}
      >
        저장
      </H3>
    </TouchableWithoutFeedback>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    borderTopWidth: 0.5,
    borderTopColor: '#C6C9D7',
    paddingTop: 12,
  },
  text: {
    color: gray[600],
    fontWeight: '600',
    marginRight: getScaleSize(20),
    textAlign: 'right',
  },
});
