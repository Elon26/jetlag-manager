import { createStore } from '@xstate/store';
import * as MediaLibrary from 'expo-media-library';
import { CameraRoll, CleanerGalleryApiV2 } from '@/modules/cleaner-gallery';
import { isNotNullOrUndefined } from '@/utils/array';
import {
  type GalleryCleanerAlbum,
  type GalleryCleanerAlbumStatus,
  GalleryCleanerAlbumStatuses,
  GalleryCleanerAvailableAlbums,
} from './types';

const initialAlbums = GalleryCleanerAvailableAlbums.reduce(
  (acc, album) => {
    acc[album] = {
      status: GalleryCleanerAlbumStatuses.idle,
      uris: [],
    };
    return acc;
  },
  {} as Record<
    GalleryCleanerAlbum,
    { status: GalleryCleanerAlbumStatus; uris: string[][] | string[] }
  >
);

export const store = createStore({
  context: {
    albums: initialAlbums,
    assets: {} as Record<string, CleanerGalleryApiV2.AssetDetails>,
  },
  on: {
    FETCH_ALBUM: (context, event: { albumName: GalleryCleanerAlbum }, enqueue) => {
      enqueue.effect(async () => {
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status !== 'granted') {
          await MediaLibrary.requestPermissionsAsync();
        }
        const { albumName } = event;
        let uris: string[][] | string[] = [];
        if (albumName === 'similarPhotos') {
          uris = (await CleanerGalleryApiV2.fetchDuplicates()).map((group) =>
            group.map((asset) => asset.uri)
          );
        } else if (albumName === 'blurryPhotos') {
          uris = (await CleanerGalleryApiV2.fetchBlurryImages(3)).map((asset) => asset.uri);
        } else {
          uris = (
            await CameraRoll.getAssets({
              collectionType: 'smartAlbum',
              collectionSubType: albumName,
              select: ['id', 'uri'],
              sortBy: [{ key: 'createdAt', asc: false }],
            })
          )
            .map((asset) => asset.uri)
            .filter(isNotNullOrUndefined);
        }

        store.send({ type: 'SET_ALBUM', albumName, uris });
      });
      return {
        ...context,
        albums: {
          ...context.albums,
          [event.albumName]: {
            status: GalleryCleanerAlbumStatuses.loading,
            uris: context.albums[event.albumName].uris,
          },
        },
      };
    },
    REFETCH_ALL: (context, _event, enqueue) => {
      for (const album of GalleryCleanerAvailableAlbums) {
        if (context.albums[album].status === GalleryCleanerAlbumStatuses.fetched) {
          enqueue.effect(() => {
            store.send({ type: 'FETCH_ALBUM', albumName: album });
          });
        }
      }
    },
    SET_ALBUM: (
      context,
      event: {
        albumName: GalleryCleanerAlbum;
        uris: string[][] | string[];
      }
    ) => {
      return {
        ...context,
        albums: {
          ...context.albums,
          [event.albumName]: {
            status: GalleryCleanerAlbumStatuses.fetched,
            uris: event.uris,
          },
        },
      };
    },
    FETCH_ASSETS: (_context, event: { assetIds: string[] }, enqueue) => {
      enqueue.effect(async () => {
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status !== 'granted') {
          await MediaLibrary.requestPermissionsAsync();
        }
        const result = await CleanerGalleryApiV2.getDetails(event.assetIds);
        const assets: Record<string, CleanerGalleryApiV2.AssetDetails> = {};
        for (const asset of result) {
          assets[asset.id] = asset;
        }
        store.send({ type: 'SET_ASSETS', assets });
      });
    },
    SET_ASSETS: (context, event: { assets: Record<string, CleanerGalleryApiV2.AssetDetails> }) => {
      return {
        ...context,
        assets: {
          ...context.assets,
          ...event.assets,
        },
      };
    },
  },
});
