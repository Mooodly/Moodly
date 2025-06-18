import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UpdateScreen from '@/features/updateProgress/ui/screens/UpdateScreen';
import { MAIN_ICONS } from '@/shared/assets/images/main';

const Splash = () => {
  useEffect(() => {
    // setTimeout(() => {
    //   resetTo('Main');
    // }, 2000);
  }, []);

  return (
    <>
      <StatusBar
        translucent
        barStyle="light-content"
      />
      <SafeAreaView className="bg-primary-300 flex-1 gap-3 flex-col justify-center items-center">
        <Image source={MAIN_ICONS.logo} />
        <UpdateScreen />
      </SafeAreaView>
    </>
  );
};

export default Splash;
