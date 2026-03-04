import type { GalleryAsset } from '@/modules/cleaner-gallery';
import { createStore } from '@xstate/store';

export const selectionStore = createStore({
  context: {
    selectedAssets: [] as GalleryAsset[],
  },
  on: {
    setSelectedAssets: (_, event: { assets: GalleryAsset[] }) => {
      const set = new Set(event.assets);
      return {
        selectedAssets: Array.from(set),
      };
    },
    clearSelectedAssets: () => {
      return {
        selectedAssets: [],
      };
    },
    addSelectedAsset: (context, event: { assets: GalleryAsset[] }) => {
      const { selectedAssets } = context;
      const set = new Set([...selectedAssets, ...event.assets]);
      return {
        selectedAssets: Array.from(set),
      };
    },
    subtractSelectedAsset: (context, event: { assets: GalleryAsset[] }) => {
      const { selectedAssets } = context;
      const set = new Set(selectedAssets);
      for (const asset of event.assets) {
        set.delete(asset);
      }
      return {
        selectedAssets: Array.from(set),
      };
    },
    addSelectedAssetByUri: (context, event: { uris: string[]; allAssets: GalleryAsset[] }) => {
      const { selectedAssets } = context;
      const set = new Set(selectedAssets);
      for (const uri of event.uris) {
        const asset = event.allAssets.find((asset) => asset.uri === uri);
        if (asset) {
          set.add(asset);
        }
      }
      return {
        selectedAssets: Array.from(set),
      };
    },
    subtractSelectedAssetByUri: (context, event: { uris: string[]; allAssets: GalleryAsset[] }) => {
      const { selectedAssets } = context;
      const set = new Set(selectedAssets);
      for (const uri of event.uris) {
        const asset = event.allAssets.find((asset) => asset.uri === uri);
        if (asset) {
          set.delete(asset);
        }
      }
      return {
        selectedAssets: Array.from(set),
      };
    },
  },
});
