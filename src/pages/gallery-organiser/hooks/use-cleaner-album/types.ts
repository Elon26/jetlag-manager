export type GalleryFetchStatus =
  | 'unknown'
  | 'error'
  | 'fetching'
  | 'fetched'
  | 'blocked';

export const GalleryCleanerAvailableAlbums = [
  'screenshots',
  'selfies',
  'videos',
  'livePhotos',
  'blurryPhotos',
  'similarPhotos',
] as const;

export type GalleryCleanerAlbum =
  (typeof GalleryCleanerAvailableAlbums)[number];

export function isGalleryCleanerAlbum(
  value: unknown
): value is GalleryCleanerAlbum {
  return (
    typeof value === 'string' &&
    GalleryCleanerAvailableAlbums.includes(value as GalleryCleanerAlbum)
  );
}

export function isNestedArray<T>(value: unknown): value is T[][] {
  return Array.isArray(value) && Array.isArray(value[0]);
}

export const AlbumName: Record<GalleryCleanerAlbum, string> = {
  blurryPhotos: 'Blurry photos',
  screenshots: 'Screenshots',
  similarPhotos: 'Similar photos',
  selfies: 'Selfies',
  videos: 'Videos',
  livePhotos: 'Live Photos',
};

export const GalleryCleanerAlbumStatuses = {
  idle: 'idle',
  loading: 'loading',
  error: 'error',
  fetched: 'fetched',
} as const;
export type GalleryCleanerAlbumStatus =
  (typeof GalleryCleanerAlbumStatuses)[keyof typeof GalleryCleanerAlbumStatuses];
