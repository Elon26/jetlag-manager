import {
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { type PropsWithChildren, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

type SheetModalProps = PropsWithChildren & {
  ref?: React.RefObject<BottomSheetModal | null>;
  className?: string;
};

export function useSheetModal() {
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  return {
    bottomSheetModalRef,
    present: () => bottomSheetModalRef.current?.present(),
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
    SheetModal: (props: SheetModalProps) => (
      <SheetModalElement ref={bottomSheetModalRef} {...props} />
    ),
  };
}

export function SheetModalElement({ children, ref, className }: SheetModalProps) {
  return (
    <BottomSheetModal
      backdropComponent={BDComponent}
      backgroundComponent={BGComponent}
      handleComponent={() => null}
      index={0}
      ref={ref}
    >
      <BottomSheetView className={twMerge('px-edge pt-6 pb-safe-offset-6', className)}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BGComponent() {
  return <View className="bg-white absolute inset-0 rounded-t-4.5xl" />;
}

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
