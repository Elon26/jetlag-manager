import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import zeroNotesImage from '@/images/zero-notes.png';
import { UiText } from '@/ui/ui-text';

export default function ZeroNotesArea() {
  const { t } = useTranslation();

  return (
    <View className="gap-y-10">
      <Image
        source={zeroNotesImage}
        style={{ width: scaleX(245), height: scaleY(253) }}
      />
      <UiText className="text-center text-lg font-medium text-gray/30">
        {t('timezone.add-some-note')}
      </UiText>
    </View>
  );
}
