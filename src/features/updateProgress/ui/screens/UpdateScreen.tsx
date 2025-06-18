import { useUpdateProgress } from '@/processes/update/useUpdateProgress';
import { StatusBar, View } from 'react-native';
import HomeIndicator from '../components/HomeIndicator';
import LoadingDots from '../components/LoadingDots';
import UpdateContent from '../components/UpdateContent';

const UpdateScreen = () => {
  const { step, progress } = useUpdateProgress();
  return (
    <View>
      <StatusBar />
      <View>
        <UpdateContent
          progress={progress}
          step={step}
        />
        <LoadingDots />
      </View>

      <HomeIndicator />
    </View>
  );
};

export default UpdateScreen;
