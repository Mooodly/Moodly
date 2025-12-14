import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWeeklyReportStatus } from '@/features/ai-report/hooks/useWeeklyReportStatus';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import { isIphone } from '@/shared/lib/user.util';
import { gray, primary } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import { Body2 } from '@/shared/ui/typography/Body2';
import { H2 } from '@/shared/ui/typography/H2';

const DayCheckList = ({ dailyStatus }: { dailyStatus: boolean[] }) => {
  return (
    <View style={styles.daysRow}>
      {dailyStatus.map((isChecked, idx) => (
        <View
          key={idx}
          style={styles.dayItem}
        >
          <Image source={isChecked ? COMMON_ICONS.iconChecked : COMMON_ICONS.iconUnchecked} />
          <Body2 style={[styles.dayText, { color: isChecked ? primary[300] : gray[400] }]}>
            {idx + 1}
          </Body2>
        </View>
      ))}
    </View>
  );
};

type Props = {
  weeklyCount: number;
  dailyStatus: boolean[];
  onConfirm: () => void;
};

export const WeeklyReportProgress = ({ weeklyCount, dailyStatus, onConfirm }: Props) => {
  const { uiState, remainForReport, isGoalReached } = useWeeklyReportStatus(weeklyCount);
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={uiState?.icon}
          style={styles.mainIcon}
        />

        <H2 style={styles.title}>{uiState?.title}</H2>

        <View style={styles.messageContainer}>
          <Body2 style={styles.grayText}>{uiState?.message}</Body2>

          {!isGoalReached && uiState?.subMessage ? (
            <Body2 style={styles.highlightText}>{remainForReport}</Body2>
          ) : null}
          {uiState?.subMessage && <Body2 style={styles.grayText}>{uiState?.subMessage}</Body2>}
        </View>

        <View style={styles.checkListContainer}>
          <DayCheckList dailyStatus={dailyStatus} />
        </View>
      </View>

      <ActionButton
        style={[styles.button, { marginBottom: isIphone() ? 0 : insets.bottom }]}
        onPress={onConfirm}
      >
        <Body2
          weight="regular"
          style={styles.buttonText}
        >
          확인
        </Body2>
      </ActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  mainIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  grayText: {
    color: gray[400],
  },
  highlightText: {
    color: primary[300],
    marginHorizontal: 2,
    fontWeight: '700',
  },
  checkListContainer: {
    marginTop: 40,
    width: '100%',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayText: {
    textAlign: 'center',
    marginTop: 4,
  },
  button: {
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
  },
});
