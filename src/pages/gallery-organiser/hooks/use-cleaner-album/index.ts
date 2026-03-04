import type { CleanerGalleryApiV2 } from '@/modules/cleaner-gallery';
import type { GalleryCleanerAlbum, GalleryCleanerAlbumStatus } from './types';
import { useSelector } from '@xstate/store/react';
import { useCallback, useEffect, useMemo } from 'react';
import { intersection } from 'remeda';
import { selectionStore } from './selection';
import { store } from './store';

export function useCleanerAlbum(name: 'similarPhotos'): {
  uris: string[][];
  status: GalleryCleanerAlbumStatus;
  refetch: () => void;
};
export function useCleanerAlbum(name: Exclude<GalleryCleanerAlbum, 'similarPhotos'>): {
  uris: string[];
  status: GalleryCleanerAlbumStatus;
  refetch: () => void;
};
export function useCleanerAlbum(name: GalleryCleanerAlbum): {
  uris: string[] | string[][];
  status: GalleryCleanerAlbumStatus;
  refetch: () => void;
};
export function useCleanerAlbum(name: GalleryCleanerAlbum) {
  const uris = useSelector(store, (state) => state.context.albums[name]?.uris || []);
  const status = useSelector(store, (state) => state.context.albums[name]?.status || 'idle');
  useEffect(() => {
    if (status === 'idle') {
      store.send({ type: 'FETCH_ALBUM', albumName: name });
    }
  }, [status, name]);

  const refetch = () => {
    store.send({ type: 'FETCH_ALBUM', albumName: name });
  };

  return {
    uris,
    status,
    refetch,
  };
}

export function useAsset(id: string) {
  const asset = useSelector(store, (state) => state.context.assets[id]);

  useEffect(() => {
    if (!asset) {
      store.send({ type: 'FETCH_ASSETS', assetIds: [id] });
    }
  }, [id, asset]);

  if (!asset) {
    return undefined;
  }
  return asset;
}

export function useAssets(ids: string[]) {
  const assets = useSelector(store, (state) => state.context.assets);
  const filteredAssets = ids.reduce(
    (acc, id) => {
      if (assets[id]) {
        acc[id] = assets[id];
      }
      return acc;
    },
    {} as Record<string, CleanerGalleryApiV2.AssetDetails>
  );
  useEffect(() => {
    const missingIds = ids.filter((id) => !filteredAssets[id]);
    if (missingIds.length > 0) {
      store.send({ type: 'FETCH_ASSETS', assetIds: missingIds });
    }
  }, [ids, filteredAssets]);
  return filteredAssets;
}

export function refetchAll() {
  store.send({ type: 'REFETCH_ALL' });
}

export function useSelection() {
  const selectedAssets = useSelector(selectionStore, (state) => state.context.selectedAssets);

  const isSelected = useMemo(() => {
    // yes, that's the least ugly way to memoize overloaded function
    function isSelectedImpl(uri: string): boolean;
    function isSelectedImpl(uri: string[]): boolean | 'mix';
    function isSelectedImpl(uri: string | string[]): boolean | 'mix' {
      if (Array.isArray(uri)) {
        if (uri.length === 0) {
          return false;
        }
        const selectedCount = intersection(selectedAssets, uri).length;
        return selectedCount === uri.length ? true : selectedCount > 0 ? 'mix' : false;
      }
      return selectedAssets.includes(uri);
    }
    return isSelectedImpl;
  }, [selectedAssets]);

  const select = useCallback((uri: string | string[]) => {
    if (Array.isArray(uri)) {
      selectionStore.send({ type: 'SELECT_GROUP', assetUris: uri });
    } else {
      selectionStore.send({ type: 'SELECT_ASSET', assetUri: uri });
    }
  }, []);

  const deselect = useCallback((uri: string | string[]) => {
    if (Array.isArray(uri)) {
      selectionStore.send({ type: 'DESELECT_GROUP', assetUris: uri });
    } else {
      selectionStore.send({ type: 'DESELECT_ASSET', assetUri: uri });
    }
  }, []);

  const clearSelection = useCallback(() => {
    selectionStore.send({ type: 'CLEAR_SELECTION' });
  }, []);

  const setSelection = useCallback((uris: string[]) => {
    selectionStore.send({ type: 'SET_SELECTION', assetUris: uris });
  }, []);
  return {
    selectedAssets,
    isSelected,
    select,
    deselect,
    clearSelection,
    setSelection,
  };
}
