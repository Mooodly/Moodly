import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { gray } from '@/shared';
import SettingWidgetGroup from './SettingWidgetGroup';
import SettingWidgetHeader from './SettingWidgetHeader';
import SettingWidgetItem from './SettingWidgetItem';

const SettingWidgetSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.inner}>
      <View style={styles.groups}>
        <SettingWidgetHeader />
        <SettingWidgetGroup>
          <SettingWidgetItem withToggle />
        </SettingWidgetGroup>
        <SettingWidgetGroup>
          <SettingWidgetItem />
        </SettingWidgetGroup>
        <SettingWidgetGroup>
          <SettingWidgetItem />
          <SettingWidgetItem />
        </SettingWidgetGroup>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[100],
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  groups: {
    flex: 1,
    gap: 16,
  },
});

export default memo(SettingWidgetSkeleton);
