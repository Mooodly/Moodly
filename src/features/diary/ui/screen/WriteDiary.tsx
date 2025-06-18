// src/screens/WriteDiary.tsx
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import InputAccessoryView from 'react-native-input-accessory-view';

import { ICON_DATA } from '@/shared/constants';
import { getScaleSize, useAppSelector } from '@/shared/hooks';
import { H2 } from '@/shared/ui/typography/H2';
import NaviDismiss from '@/widgets/navigation-bar/ui/NaviDismiss';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

import { useDiarySave } from '@/processes/diary/useDiarySave';
import { isNotEmpty } from '@/shared/lib';
import { common } from '@/shared/styles/colors';
import { KeyboardAccessoryButton } from '@/shared/ui/elements/KeyboardAccessory';

const actionButtons = [{ item: <NaviDismiss />, disabled: false }];

const WriteDiary = () => {
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const scrollRef = useRef<ScrollView>(null);

  const [text, setText] = useState('');
  const save = useDiarySave(text);

  useEffect(() => {
    setText(isNotEmpty(selectedDiary) ? (selectedDiary?.description ?? '') : '');
  }, [selectedDiary]);

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <KeyboardAvoidingView
        className="flex-1 bg-common-white"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.keyboardAvoiding}
          keyboardShouldPersistTaps="handled"
          onScroll={({ nativeEvent }) => {
            console.log('[ScrollView] contentOffset.y =', nativeEvent.contentOffset.y);
          }}
        >
          <View className="items-center justify-center bg-common-white">
            <H2 weight="semibold">왜 이 감정을 느꼈나요?</H2>
            <Image
              style={styles.emotionImage}
              source={ICON_DATA.find(el => el.id === todayDiary?.iconId)?.iconBig}
            />
          </View>

          <View className="flex-1">
            <TextInput
              className="min-h-32 pb-10"
              multiline
              value={text}
              onChangeText={setText}
              scrollEnabled={false}
              placeholder="그 감정을 느낀 순간의 생각을 적어보세요"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <InputAccessoryView
        spaceHeight={40}
        extraHeight={0}
        renderView={() => <KeyboardAccessoryButton onPress={save} />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  emotionImage: {
    height: getScaleSize(190),
    marginBottom: getScaleSize(32),
    marginTop: getScaleSize(9),
    width: getScaleSize(190),
  },
  keyboardAvoiding: {
    backgroundColor: common.white,
    flex: 1,
    paddingHorizontal: getScaleSize(20),
  },
});

export default WriteDiary;
