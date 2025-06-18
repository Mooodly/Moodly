import Progress from '@/shared/ui/elements/Progress';
import { MotiView, Text, View } from 'moti';

interface ProgressStepProps {
  step: string;
  progress: number;
}

const UpdateContent = ({ step, progress }: ProgressStepProps) => {
  return (
    <MotiView
      from={{ translateY: 20, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ type: 'timing', duration: 600, delay: 300 }}
      className="w-full max-w-xs my-6 space-y-6"
    >
      <View className="items-center mb-4 space-y-1">
        <Text className="text-white text-lg font-semibold">
          앱을 최신상태로 업데이트하는 중입니다
        </Text>
        <Text className="text-white/80 text-sm">잠시만 기다려주세요...</Text>
      </View>
      <View className="space-y-3">
        <Progress
          value={progress}
          className="h-2 bg-white/20"
        />
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-white/90 text-sm">{step}</Text>
          <Text className="text-white/90 text-sm">{Math.round(progress)}%</Text>
        </View>
      </View>
    </MotiView>
  );
};

export default styled(UpdateContent);
