import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { UiText } from '@/ui/ui-text';

type TabBtnProps = {
  title: string;
  onPress: () => void;
  active?: boolean;
};

export function TabButton({ title, onPress, active }: TabBtnProps) {
  return (
    <TouchableOpacity
      className={twMerge(
        'h-9.5 items-center justify-center rounded-lg px-4',
        active ? 'bg-primary' : 'bg-[#F6F6F6]'
      )}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <UiText
        className={twMerge(
          'font-medium',
          active ? 'text-white' : 'text-[#616973]'
        )}
      >
        {title}
      </UiText>
    </TouchableOpacity>
  );
}
