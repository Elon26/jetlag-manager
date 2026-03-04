import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import numbro from 'numbro';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCleanerAlbum } from '@/pages/gallery-organiser/hooks/use-cleaner-album';
import GalleryIcon from '@/svg/main/gallery.svg';
import GalleryOrganiserIcon from '@/svg/main/gallery-organiser.svg';

import { SquareWidget } from './square-widget';

export function GalleryOrganiserWidget() {
  const [locked, setLocked] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
      const perm = await MediaLibrary.getPermissionsAsync();
      if (perm.status === 'granted') {
        setLocked(false);
      } else {
        setLocked(true);
      }
    })();
  }, []);

  const { uris: screenshots, status: screenshotsStatus } =
    useCleanerAlbum('screenshots');
  const { uris: blurryPhotos, status: blurryPhotosStatus } =
    useCleanerAlbum('blurryPhotos');
  const { uris: similarPhotos, status: similarPhotosStatus } =
    useCleanerAlbum('similarPhotos');
  const { uris: selfies, status: selfiesStatus } = useCleanerAlbum('selfies');
  const { uris: livePhotos, status: livePhotosStatus } =
    useCleanerAlbum('livePhotos');

  const total = new Set<string>([
    ...(screenshots as string[]),
    ...(blurryPhotos as string[]),
    ...(livePhotos as string[]),
    ...(selfies as string[]),
    ...similarPhotos.flat(),
  ]);
  const size = total.size;

  const statuses = [
    screenshotsStatus,
    blurryPhotosStatus,
    similarPhotosStatus,
    selfiesStatus,
    livePhotosStatus,
  ];
  const isLoading = statuses.some((s) => s === 'loading');

  const [photosText, setPhotosText] = useState('...');

  useEffect(() => {
    if (isLoading) {
      setPhotosText('...');
    } else {
      setPhotosText(numbro(size).format({ thousandSeparated: true }));
    }
  }, [isLoading, size]);

  return (
    <SquareWidget
      title={t('cleaner.gallery-organiser.widget.title')}
      icon={GalleryOrganiserIcon}
      onPress={() => router.navigate('/gallery-organiser')}
      locked={locked}
      stats={[{ value: photosText, Icon: GalleryIcon }]}
    />
  );
}
