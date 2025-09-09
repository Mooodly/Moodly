import { type BottomSheetHandler, SocialLoginSheet } from '@features/setting/ui/SocialLoginSheet';
import { useFocusEffect } from '@react-navigation/native';
import { ONBOARDING_ICONS } from '@shared/assets/images/onboarding';
import { useNotificationPermission } from '@shared/hooks/useNotificationPermission';
import colors from '@shared/styles/colors';
import ActionButton from '@shared/ui/elements/ActionButton';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type FlatListProps,
  Image,
  type ImageSourcePropType,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { H2 } from '../shared/ui/typography/H2';
import { Label } from '../shared/ui/typography/Label';

interface DotProps {
  active: boolean;
}

interface SlideProps {
  id: number;
  title: string;
  message: string;
  source: ImageSourcePropType;
}
const SLIDES: ReadonlyArray<SlideProps> = [
  {
    id: 1,
    title: '하루에 한 번, 감정을 마주하는 시간',
    message: '무들리는 하루 한 번,\n 나를 돌아보는 시간을 만들어줍니다.',
    source: ONBOARDING_ICONS.onboardingStep1,
  },
  {
    id: 2,
    title: '감정을 고르고, 이유를 적어요',
    message: '감정을 선택하고\n짧게 이유를 적어보세요.',
    source: ONBOARDING_ICONS.onboardingStep2,
  },
  {
    id: 3,
    title: '잊지 않도록 알림을 드려요',
    message: '하루의 감정은 금방 지나가요.\n그 순간을 놓치지 않도록 알려드릴게요.',
    source: ONBOARDING_ICONS.onboardingStep3,
  },
  {
    id: 4,
    title: '감정의 흐름을 파악하세요',
    message: '감정은 달력에 쌓이며\n나를 이해하는 단서가 됩니다.',

    source: ONBOARDING_ICONS.onboardingStep4,
  },
];

const OnboardingPage = () => {
  const { width, height } = useWindowDimensions();
  const listRef = useRef<FlatList<SlideProps>>(null);
  const [index, setIndex] = useState<number>(0);
  const isScrollingRef = useRef(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [showAlarmPermission, setShowAlarmPermission] = useState(false);
  const socialSheetRef = useRef<BottomSheetHandler>(null);

  const { requestNativeNotificationPermission } = useNotificationPermission();

  useFocusEffect(
    useCallback(() => {
      return () => {
        socialSheetRef.current?.close();
      };
    }, []),
  );
  const total = SLIDES.length;
  const isLast = index === total - 1;

  const getItemLayout = useCallback<NonNullable<FlatListProps<SlideProps>['getItemLayout']>>(
    (data, i) => ({
      length: width,
      offset: width * i,
      index: i,
    }),
    [width],
  );

  const keyExtractor = useCallback((item: SlideProps) => String(item.id), []);

  const renderItem = useCallback<ListRenderItem<SlideProps>>(
    ({ item }) => (
      <View
        className="flex-1 justify-center items-center px-[10px] gap-10"
        style={{ width, height }}
      >
        <View className="mb-10 justify-center gap-3">
          <H2 weight="semibold">{item.title}</H2>
          <Label
            weight="regular"
            style={{ color: colors.gray[400], textAlign: 'center' }}
          >
            {item.message}
          </Label>
        </View>
        <Image
          className="h-[70%] bottom-12 w-full items-center gap-3"
          source={item.source}
          resizeMode="contain"
        />
      </View>
    ),
    [width, height],
  );

  const onMomentumScrollEnd = useCallback(
    async (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const viewWidth = e.nativeEvent.layoutMeasurement.width;
      const x = e.nativeEvent.contentOffset.x;

      const ratio = x / viewWidth;

      const next = Math.floor(ratio) + (ratio % 1 > 0.3 ? 1 : 0);
      if (next !== index) setIndex(next);
      setShowStartButton(next === total - 1);
      if (next === 2 && !showAlarmPermission) {
        setShowAlarmPermission(true);
        await requestNativeNotificationPermission();
      }
      isScrollingRef.current = false;
    },
    [index, requestNativeNotificationPermission, showAlarmPermission, total],
  );

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingRef.current) return;
      const viewWidth = width;
      const ratio = nativeEvent.contentOffset.x / viewWidth;

      const base = Math.floor(ratio);
      const frac = ratio - base;

      if (frac >= 0.2) {
        if (base === 2 && showStartButton) {
          setShowStartButton(false);
        }
      }
    },
    [width, showStartButton],
  );

  const Dots = useMemo(() => {
    const Dot = ({ active }: DotProps) => (
      <View className={`w-2 h-2 rounded-full ${active ? 'bg-primary-300' : 'bg-gray-200'}`} />
    );
    return () => (
      <View
        className="flex-row justify-center gap-2 py-3 mt-[31px]"
        accessibilityLabel="페이지 인디케이터"
      >
        {SLIDES.map((s, i) => (
          <Dot
            key={s.id}
            active={i === index}
          />
        ))}
      </View>
    );
  }, [index]);

  const onSkip = () => {
    listRef.current?.scrollToIndex({ index: total - 1, animated: true });
  };

  const startService = async () => {
    socialSheetRef.current?.expand();
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right'] as const}
      className="flex-1 bg-common-white"
    >
      <View className="flex-1 bg-common-white">
        <View className="absolute top-0 right-0 z-10 w-full h-[56px] justify-center items-end px-5">
          {!isLast && (
            <Pressable
              onPress={onSkip}
              accessibilityLabel="건너뛰기"
            >
              <Label
                weight="regular"
                style={{ color: colors.gray[300] }}
              >
                Skip
              </Label>
            </Pressable>
          )}
        </View>
        <Dots />

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={onScroll}
          getItemLayout={getItemLayout}
          windowSize={2}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          overScrollMode={Platform.OS === 'android' ? 'never' : 'auto'}
          scrollEventThrottle={16}
        />
      </View>
      {showStartButton && (
        <View className="absolute bottom-12 w-full items-center gap-3 px-5">
          <ActionButton onPress={startService}>서비스 시작하기</ActionButton>
        </View>
      )}
      <SocialLoginSheet ref={socialSheetRef} />
    </SafeAreaView>
  );
};

export default OnboardingPage;
