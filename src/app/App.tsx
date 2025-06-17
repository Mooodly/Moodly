/* eslint-disable */
import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ProfilerOnRenderCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import { navigationRef } from '@/shared/lib';
import '../../global.css';

import { HotUpdater, getUpdateSource } from '@hot-updater/react-native';
import { Text, View } from 'react-native';
import RootStack from './navigation/RootStack';
import store from './store';

dayjs.locale('ko');

enableScreens();

//TEST: - 랜더링 테스트 로그 코드
export const onRenderCallback: ProfilerOnRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  console.log(
    `onRenderCallback: ${id}, phase: ${phase}, actualDuration: ${actualDuration}, baseDuration: ${baseDuration}, startTime: ${startTime}, commitTime: ${commitTime}`
  );
};

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default HotUpdater.wrap({
  source: getUpdateSource('https://lmjbkeqjglahtuqbzyic.supabase.co/functions/v1/update-server', {
    updateStrategy: 'fingerprint',
  }),
  fallbackComponent: ({ progress, status }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{status === 'UPDATING' ? 'Updating...' : 'Checking...'}</Text>
      {progress > 0 && <Text>{Math.round(progress * 100)}%</Text>}
    </View>
  ),
})(App);
