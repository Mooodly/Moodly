import { Text, View } from 'react-native';

const UpdateStatusBar = () => {
  return (
    <View className="flex-row justify-between items-center px-6 pt-3 pb-2 text-white text-sm font-medium">
      <Text>9:41</Text>
      <View className="flex items-center space-x-1">
        <View className="flex space-x-1">
          <View className="w-1 h-3 bg-white rounded-full"></View>
          <View className="w-1 h-3 bg-white rounded-full"></View>
          <View className="w-1 h-3 bg-white rounded-full"></View>
          <View className="w-1 h-3 bg-white/60 rounded-full"></View>
        </View>
        <View className="w-6 h-3 border border-white rounded-sm">
          <View className="w-4 h-1.5 bg-white rounded-sm m-0.5"></View>
        </View>
      </View>
    </View>
  );
};

export default UpdateStatusBar;
