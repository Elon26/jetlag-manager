import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import type { RContact } from '@/modules/contacts-kit/react/types';
import { UiText } from '@/ui/ui-text';

type AnagramProps = {
  contact: RContact;
  className?: string;
};

export function Anagram({ contact, className }: AnagramProps) {
  const anagram = useMemo(() => {
    const first = contact.givenName?.trim();
    const last = contact.familyName?.trim();

    if (first && last) {
      return `${first[0]}${last[0]}`;
    }

    const parts = first?.split(' ') ?? [];
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }

    return (first?.[0] ?? 'U').toUpperCase();
  }, [contact]);

  return (
    <View
      className={twMerge(
        'size-10 items-center justify-center overflow-hidden rounded-full',
        className
      )}
    >
      <LinearGradient
        colors={['#4F6EF7', '#3C8CF0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <UiText className="text-base font-medium uppercase text-white">
        {anagram}
      </UiText>
    </View>
  );
}
