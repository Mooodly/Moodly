import { StyleSheet, View } from 'react-native';

import { SetNicknameForm } from '@/features/set-nickname/ui/SetNicknameForm';
import { getScaleSize } from '@/shared/hooks/useScale';
import { resetTo } from '@/shared/lib/navigation.util';
import NavigationBar from '@/shared/ui/elements/navigation/NavigationBar';
import { H2 } from '@/shared/ui/typography/H2';

const NicknamePage = () => {
  const handleSuccess = () => {
    resetTo('Main');
  };

  return (
    <>
      <NavigationBar />
      <View style={styles.container}>
        <View style={styles.inner}>
          <H2
            weight="semibold"
            style={styles.title}
          >
            사용하실 닉네임을 알려주세요.
          </H2>
          <SetNicknameForm onSuccess={handleSuccess} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    textAlign: 'left',
    marginBottom: getScaleSize(40),
  },
});

export default NicknamePage;
