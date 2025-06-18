// src/shared/ui/progress/Progress.tsx

import { View } from 'react-native';

export interface ProgressProps {
  value: number;
  className?: string;
}

const Progress = ({ value, className }: ProgressProps) => {
  return (
    <View
      role="progressbar"
      aria-valuenow={value}
      className={className}
    >
      <View
        style={{ width: `${value}%` }}
        className="h-full bg-white rounded-full"
      />
    </View>
  );
};

export default Progress;
