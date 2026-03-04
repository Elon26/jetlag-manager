import RNLottieView, { type LottieViewProps } from 'lottie-react-native';
import { cssInterop } from 'nativewind';

type Props = LottieViewProps & {
  className?: string;
};

export function LottieView({ className = '', ...props }: Props) {
  // @ts-expect-error
  return <RNLottieView className={className} {...props} />;
}

cssInterop(RNLottieView, {
  className: {
    target: 'style',
  },
});
