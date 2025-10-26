import { common, gray, SkeletonContainer } from '@/shared';
import React, { memo, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

const Divider = () => <View style={styles.divider} />;

const SettingWidgetGroup = ({ children }: PropsWithChildren) => {
  const items = React.Children.toArray(children);
  return (
    <SkeletonContainer style={styles.container}>
      {items.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </SkeletonContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: common.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: gray[100],
    marginHorizontal: 16,
  },
});

export default memo(SettingWidgetGroup);
