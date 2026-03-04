import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useLayoutInsets({ withTabs = false } = {}) {
  const headerHeight = useHeaderHeight();
  const safeInsets = useSafeAreaInsets();

  const bottomInset = withTabs ? safeInsets.bottom + scaleY(64 + 8) : safeInsets.bottom;

  return {
    top: headerHeight,
    bottom: bottomInset,
    left: scaleX(16),
    right: scaleX(16),
  };
}
