import { View } from 'react-native';

export default function HomeIndicator() {
  return (
    <View className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
      <View className="w-32 h-1 bg-white/30 rounded-full" />
    </View>
  );
}
