import type { SvgProps } from 'react-native-svg';
import {
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { scaleX } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { type FC, type ReactNode, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';

export function useSheetModal(options: Omit<SheetModalProps, 'ref'>) {
  const sheetRef = useRef<BottomSheetModal | null>(null);

  return {
    sheetRef,
    present: () => {
      sheetRef.current?.present();
    },
    dismiss: () => {
      sheetRef.current?.dismiss();
    },
    SheetModalComponent: () => <SheetModal {...options} ref={sheetRef} />,
  };
}

type SheetModalProps = {
  ref: React.Ref<BottomSheetModal | null>;
  title?: string;
  description?: string;
  svg?: FC<SvgProps>;
  actions?: {
    label: string;
    action: () => void;
    type?: 'cancel';
  }[];
  children?: ReactNode;
};

function SheetModal({
  ref,
  title,
  description,
  actions,
  svg: SvgImage,
  children,
}: SheetModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetModal
      backdropComponent={BDComponent}
      backgroundComponent={() => (
        <View
          className="absolute inset-0 rounded-t-4.5xl bg-white"
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.07,
            shadowRadius: 12,
          }}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: '#D8D8D8', width: scaleX(60) }}
      index={0}
      ref={ref}
    >
      <BottomSheetView className="gap-15 px-edge" style={{ paddingBottom: insets.bottom + 10 }}>
        <View>
          {SvgImage && <SvgImage className="m-6 size-40 self-center" />}
          {title || description ? (
            <View className="gap-8">
              {title && <UiText className="text-center text-1.5xl font-semibold">{title}</UiText>}
              {description && (
                <UiText className="text-center text-sm text-gray">{description}</UiText>
              )}
            </View>
          ) : null}
          {children}
        </View>
        {actions && (
          <View className="gap-2.5 px-edge">
            {actions.map((action) => (
              <ButtonPrimary
                className={action.type === 'cancel' ? 'bg-transparent' : ''}
                key={action.label}
                label={action.label}
                labelClassName={action.type === 'cancel' ? 'text-text' : ''}
                onPress={action.action}
              />
            ))}
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BDComponent(props: BottomSheetBackdropProps) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(props.animatedIndex.value, [-1, 0], [0, 1]),
  }));
  const { dismiss } = useBottomSheetModal();
  return (
    <AnimatedPressable className="absolute inset-0" onPress={() => dismiss()} style={style}>
      <BlurView className="absolute inset-0" intensity={5} tint="dark" />
    </AnimatedPressable>
  );
}
