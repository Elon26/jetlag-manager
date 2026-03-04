import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import {
  type ExpoWithPincodeType,
  PincodeInputField,
  PincodeScreen,
  PinpadButton,
  usePinInputState,
  usePinSettings,
} from 'expo-with-pincode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { Layout } from '@/components/layout';
import { colors, shadows } from '@/config/theme';
import FaceIdIcon from '@/svg/secret-folder/face-id.svg';
import LockIcon from '@/svg/secret-folder/lock.svg';
import UnlockIcon from '@/svg/secret-folder/unlock.svg';
import { UiText } from '@/ui/ui-text';

export function AuthScreen() {
  return <Screen mode="check" />;
}
export function SetPinScreen() {
  return <Screen mode="set-or-change" />;
}
export function ResetPinScreen() {
  return <Screen mode="reset" />;
}

type ScreenProps = {
  mode: 'check' | 'set-or-change' | 'reset';
};

function Screen({ mode }: ScreenProps) {
  const { t } = useTranslation();
  const { message, cursor, error, success } = usePinInputState();
  const { isPincodeSet, isBiometricsAvailable, isFaceIdEnabled } =
    usePinSettings();

  const initialMode =
    mode !== 'check' ? (isPincodeSet ? 'reset' : 'create') : 'check';

  const [screenMode, setScreenMode] = useState<'reset' | 'create' | 'check'>(
    initialMode
  );

  const faceIdButtonEnabled =
    isBiometricsAvailable && isFaceIdEnabled && mode === 'check';

  const backspaceButtonEnabled = cursor > 0;
  const insets = useSafeAreaInsets();

  return (
    <Layout safeArea={false}>
      <PincodeScreen
        className="items-center"
        mode={screenMode}
        onSuccessfulResetPincode={() => {
          if (mode === 'set-or-change') setScreenMode('create');
          else router.back();
        }}
        onSuccessfulSetPincode={router.back}
        style={{ gap: scaleY(20), paddingTop: insets.top + scaleY(100) }}
      >
        <Animated.View
          key={success ? 'unlock' : 'lock'}
          entering={ZoomIn.springify().damping(50)}
          exiting={FadeOut.duration(150)}
        >
          {success ? <UnlockIcon /> : <LockIcon />}
        </Animated.View>

        <UiText
          className={twMerge(
            'font-semibold',
            error && 'text-[#FF4D4D]',
            success && 'text-primary'
          )}
        >
          {message}
        </UiText>

        <PincodeInputField
          characterElement={Char}
          className="flex-row gap-6.5"
          style={{ paddingBottom: scaleY(20) }}
        />

        <View className="items-center gap-y-8 ">
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
          ].map((row, i) => (
            <View key={i} className="flex-row gap-x-7">
              {row.map((n) => (
                <PincodeButton
                  key={n}
                  value={n as ExpoWithPincodeType.PinpadValue}
                />
              ))}
            </View>
          ))}

          <View className="flex-row gap-x-7">
            <View className="size-17" />
            <PincodeButton value={'0' as ExpoWithPincodeType.PinpadValue} />
            <View className="size-17" />
          </View>
        </View>

        <View className="mt-6 w-full flex-row justify-between px-10">
          {faceIdButtonEnabled ? (
            <PincodeButton value="faceid" />
          ) : (
            <View className="size-17" />
          )}

          <PincodeButton value="backspace" disabled={!backspaceButtonEnabled} />
        </View>
      </PincodeScreen>
    </Layout>
  );
}

type PincodeButtonProps = {
  value: ExpoWithPincodeType.PinpadValue;
  disabled?: boolean;
};

function PincodeButton({ value, disabled = false }: PincodeButtonProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const handlePressIn = () => (scale.value = withSpring(0.6));
  const handlePressOut = () => (scale.value = withSpring(1));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDigit = typeof value === 'string' && /^\d$/.test(value);

  return (
    <Animated.View
      className={twMerge(
        'size-17 rounded-full',

        value === 'backspace' && 'bg-transparent',
        value === 'faceid' && 'bg-white',

        isDigit && !disabled && 'bg-[#4074FB]',
        isDigit && disabled && 'bg-white opacity-70',

        value === 'faceid' && disabled && 'opacity-70',
        value === 'backspace' && disabled && 'opacity-70'
      )}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      style={[
        animatedStyle,
        value !== 'faceid' && value !== 'backspace' && shadows.sm,
      ]}
    >
      <PinpadButton
        value={value}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        {value === 'backspace' && (
          <UiText className="text-lg font-semibold text-[#709CE0]">
            {t('secret-folder.auth.delete')}
          </UiText>
        )}

        {value === 'faceid' && <FaceIdIcon />}

        {isDigit && (
          <UiText className="text-1.5xl font-semibold color-white">
            {value}
          </UiText>
        )}
      </PinpadButton>
    </Animated.View>
  );
}

type CharacterProps = { value?: number | null };

function Char({ value }: CharacterProps) {
  const { error, success } = usePinInputState();
  const tintColor = useSharedValue(colors.primary.toString());

  useEffect(() => {
    tintColor.value = withTiming(
      error ? colors.red.toString() : colors.primary.toString(),
      { duration: 200 }
    );
  }, [error]);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: tintColor.value,
    backgroundColor: tintColor.value,
  }));

  return (
    <Animated.View
      className="size-4 items-center justify-center rounded-full border"
      style={animatedBorder}
    >
      {value === null && !success && (
        <Animated.View
          className="size-full rounded-full bg-white"
          entering={ZoomIn.duration(200)}
          exiting={ZoomOut.duration(200)}
        />
      )}
    </Animated.View>
  );
}
