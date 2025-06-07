/* eslint-disable */
import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ProfilerOnRenderCallback } from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import { navigationRef } from '@/shared/lib';
import '../../global.css';

import { HOT_UPDATER_LINK } from '@env';
import { getUpdateSource, HotUpdater } from '@hot-updater/react-native';
import { Text, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import RootStack from './navigation/RootStack';
import store from './store';

dayjs.locale('ko');

enableScreens();

//TEST: - Hot updator 테스트 화면
function HotUpdatorTest() {
  return (
    <View>
      <Text>테스트</Text>
    </View>
  );
}

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
      <KeyboardProvider>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </KeyboardProvider>
    </Provider>
  );
}

export default HotUpdater.wrap({
  source: getUpdateSource(HOT_UPDATER_LINK),
  fallbackComponent: ({ progress, status }) => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>
        {status === 'UPDATING' ? '업데이트 중…' : '업데이트 확인 중…'}
      </Text>
      {progress > 0 && (
        <Text style={{ color: 'white', fontSize: 16 }}>{Math.round(progress * 100)}%</Text>
      )}
    </View>
  ),
})(App);
