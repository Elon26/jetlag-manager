import { useCleanerAlbum } from './use-cleaner-album';

export function useTotalUsage() {
  const { uris: screenshots, status: screenshotsStatus } =
    useCleanerAlbum('screenshots');
  const { uris: selfies, status: selfiesStatus } = useCleanerAlbum('selfies');
  const { uris: videos, status: videosStatus } = useCleanerAlbum('videos');
  const { uris: livePhotos, status: livePhotosStatus } =
    useCleanerAlbum('livePhotos');
  const { uris: blurryPhotos, status: blurryPhotosStatus } =
    useCleanerAlbum('blurryPhotos');
  const { uris: similarPhotos, status: similarPhotosStatus } =
    useCleanerAlbum('similarPhotos');
  const isLoading = [
    screenshotsStatus,
    selfiesStatus,
    videosStatus,
    livePhotosStatus,
    blurryPhotosStatus,
    similarPhotosStatus,
  ].includes('loading');

  const totalItems =
    screenshots.length +
    selfies.length +
    videos.length +
    livePhotos.length +
    blurryPhotos.length +
    similarPhotos.flat().length;

  return {
    isLoading,
    totalItems,
    items: {
      screenshots: {
        items: screenshots,
        status: screenshotsStatus,
      },
      selfies: {
        items: selfies,
        status: selfiesStatus,
      },
      videos: {
        items: videos,
        status: videosStatus,
      },
      livePhotos: {
        items: livePhotos,
        status: livePhotosStatus,
      },
      blurryPhotos: {
        items: blurryPhotos,
        status: blurryPhotosStatus,
      },
      similarPhotos: {
        items: similarPhotos.flat(),
        status: similarPhotosStatus,
      },
    },
  };
}
