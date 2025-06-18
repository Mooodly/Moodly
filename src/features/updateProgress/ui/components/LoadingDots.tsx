import { MotiView } from 'moti';
import { View } from 'react-native';

const LoadingDots = () => {
  return (
    <View className="flex justify-center h-10">
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 600 }}
        className="flex space-x-1"
      >
        {[0, 1, 2].map(i => (
          <MotiView
            key={i}
            from={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              loop: true,
              type: 'timing',
              duration: 1500,
              delay: i * 200,
            }}
            className="w-2 h-2 bg-white/60 rounded-full"
          />
        ))}
      </MotiView>
    </View>
  );
};

export default LoadingDots;
