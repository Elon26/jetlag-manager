import { shadows } from '@/config/theme';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import AlertIcon from '@/svg/gallery-organiser/alert.svg';
import SuccessIcon from '@/svg/gallery-organiser/success.svg';
import { UiText } from '@/ui/ui-text';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

export function CleanerNotifications() {
  const { t } = useTranslation();
  const lastCleaned = useStorageValue('lastCleaningTimestamp');
  const hideUntil = useStorageValue('cleanerWidgetHideUntil');
  const setHideUntil = useSetStorage('cleanerWidgetHideUntil');

  const [hideAlert, setHideAlert] = useState(false);

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const needsCleaning = !lastCleaned || (now - Number(lastCleaned)) / DAY >= 7;

  if (!needsCleaning && hideUntil && Number(hideUntil) > now) {
    return null;
  }

  const hideSuccessFor7Days = () => {
    setHideUntil(now + 7 * DAY);
  };

  if (needsCleaning) {
    if (hideAlert) return null;

    return (
      <View className="pt-2.5">
        <View
          className="flex-row items-center gap-1.5 rounded-3xl bg-white p-3"
          style={shadows.md}
        >
          <AlertIcon />

          <TouchableOpacity
            className="absolute right-2 top-2"
            hitSlop={15}
            onPress={() => setHideAlert(true)}
          >
            <CloseIcon />
          </TouchableOpacity>

          <View>
            <UiText className="pb-2 text-base font-semibold">
              {t('cleaner.notifications.no-cleaning.title')}
            </UiText>
            <UiText className="text-sm text-[#747473]">
              {t('cleaner.notifications.no-cleaning.description')}
            </UiText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="pt-2.5">
      <View
        className="flex-row items-center gap-1.5 rounded-3xl bg-white p-3"
        style={shadows.md}
      >
        <SuccessIcon />
        <TouchableOpacity
          className="absolute right-2 top-2"
          hitSlop={15}
          onPress={hideSuccessFor7Days}
        >
          <CloseIcon />
        </TouchableOpacity>

        <View>
          <UiText className="pb-2 text-base font-semibold">
            {t('cleaner.notifications.all-right.title')}
          </UiText>
          <UiText className="text-sm text-[#747473]">
            {t('cleaner.notifications.all-right.description')}
          </UiText>
        </View>
      </View>
    </View>
  );
}
