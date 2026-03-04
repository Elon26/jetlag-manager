import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { shadows } from '@/config/theme';
import ArrowLeftIcon from '@/svg/time-zone/arrow-left.svg';
import ArrowRightIcon from '@/svg/time-zone/arrow-right.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type PrioritySelectorProps = {
  selectedPriority: number;
  setSelectedPriority: Dispatch<SetStateAction<number>>;
  maxPriority: number;
};

export function PrioritySelector({
  selectedPriority,
  setSelectedPriority,
  maxPriority,
}: PrioritySelectorProps) {
  const { t } = useTranslation();

  function handlePlusPriority() {
    if (selectedPriority < maxPriority) setSelectedPriority((prev) => ++prev);
  }

  function handleMinusPriority() {
    if (selectedPriority > 1) setSelectedPriority((prev) => --prev);
  }

  return (
    <View
      className="mx-1 h-13 flex-row items-center justify-between gap-x-1 rounded-xl bg-white px-2"
      style={shadows.md}
    >
      <UiText className="text-gray">{t('timezone.priority')}</UiText>
      <Pressable onPress={handleMinusPriority}>
        <ArrowLeftIcon />
      </Pressable>
      <UiText className="text-xl font-semibold">{selectedPriority}</UiText>
      <Pressable onPress={handlePlusPriority}>
        <ArrowRightIcon />
      </Pressable>
    </View>
  );
}
