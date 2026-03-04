import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import GalleryIcon from '@/svg/main/gallery.svg';
import GalleryOrganiserIcon from '@/svg/main/gallery-organiser.svg';

import { SquareWidget } from './square-widget';

export function GalleryOrganiserWidgetLock() {
  const { t } = useTranslation();
  return (
    <SquareWidget
      title={t('cleaner.gallery-organiser.widget.title')}
      icon={GalleryOrganiserIcon}
      onPress={() => router.navigate('/gallery-organiser')}
      locked={true}
      stats={[{ value: '-', Icon: GalleryIcon }]}
    />
  );
}
