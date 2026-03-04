import type { GalleryAsset } from '@/modules/cleaner-gallery';
import { useSelector } from '@xstate/store/react';
import { isNotNullOrUndefined } from '@/utils/array';
import { assert } from '@/utils/assert';
import { selectionStore } from './store';

/**
 * Manages selection state for a subset of assets.
 *
 * Provides utility functions for selecting, deselecting, and toggling asset selection
 * within a defined subset of system-wide assets.
 *
 * @param assets - The subset of assets to manage selection for.
 * @returns Selection state and utility functions.
 */
export function useSelectedAssets(assets: GalleryAsset[]) {
  const allUris = assets.map(({ uri }) => uri).filter(isNotNullOrUndefined);
  const selectedAssets = useSelector(selectionStore, (state) => state.context.selectedAssets);

  const selectedUris = selectedAssets.map(({ uri }) => uri);
  const addSelectedAssetsByUri = (uris: string[]) => {
    selectionStore.send({
      type: 'addSelectedAssetByUri',
      uris,
      allAssets: assets,
    });
  };
  const subtractSelectedAssetsByUri = (uris: string[]) => {
    selectionStore.send({
      type: 'subtractSelectedAssetByUri',
      uris,
      allAssets: assets,
    });
  };
  const setSelectedByUri = (uris: string[]) => {
    selectionStore.send({
      type: 'subtractSelectedAssetByUri',
      uris: allUris,
      allAssets: assets,
    });
    selectionStore.send({
      type: 'addSelectedAssetByUri',
      uris,
      allAssets: assets,
    });
  };
  const selectAll = () => {
    selectionStore.send({
      type: 'addSelectedAssetByUri',
      uris: allUris,
      allAssets: assets,
    });
  };
  const deselectAll = () => {
    selectionStore.send({
      type: 'subtractSelectedAssetByUri',
      uris: allUris,
      allAssets: assets,
    });
  };
  const clearSelectedAssets = () => {
    selectionStore.send({ type: 'clearSelectedAssets' });
  };
  const isAllSelected =
    !!assets.length && assets.every((asset) => selectedUris.includes(asset.uri));

  const isSelected = (asset: string | GalleryAsset) => {
    if (typeof asset === 'string') {
      return selectedUris.includes(asset);
    }
    return selectedUris.includes(asset.uri);
  };

  const isPartialSelected =
    !!assets.length && assets.some((asset) => selectedUris.includes(asset.uri));

  const toggleSelect = (asset: GalleryAsset | string) => {
    if (typeof asset === 'string') {
      if (selectedUris.includes(asset)) {
        subtractSelectedAssetsByUri([asset]);
      } else {
        addSelectedAssetsByUri([asset]);
      }
    } else {
      assert(asset.uri);
      if (selectedUris.includes(asset.uri)) {
        subtractSelectedAssetsByUri([asset.uri]);
      } else {
        addSelectedAssetsByUri([asset.uri]);
      }
    }
    return selectionStore.getSnapshot().context.selectedAssets;
  };

  const setSelectedAssets = (assets: GalleryAsset[]) => {
    selectionStore.send({ type: 'setSelectedAssets', assets });
  };

  const selectedWithinSubset = selectedAssets.filter((asset) => assets.includes(asset));

  return {
    /**
     * Array of all selected assets, regardless of the current subset.
     */
    selectedAssets,
    /**
     * Array of all selected assets within the current subset.
     */
    selectedWithinSubset,
    /**
     * Array of all selected uris, regardless of the current subset.
     */
    selectedUris,
    /**
     * Adds the specified assets to the selection.
     *
     * @param uris - An array of asset URIs to add to the selection.
     */
    addSelectedAssetsByUri,
    /**
     * Removes the specified assets from the selection.
     *
     * @param uris - An array of asset URIs to remove from the selection.
     */
    subtractSelectedAssetsByUri,
    /**
     * Updates the selection to match the specified URIs, but only within the provided asset subset.
     *
     * This method first deselects all assets in the current subset (`assets`),
     * then selects only the assets whose URIs are included in the provided `uris` array.
     * It does not affect assets outside the subset.
     *
     * @param uris - An array of asset URIs to be selected within the current subset.
     */
    setSelectedByUri,
    /**
     * Sets the selection to the provided assets, regardless of the current subset.
     *
     * @param assets - An array of assets to select.
     */
    setSelected: setSelectedAssets,
    /**
     * Selects all assets within the provided subset.
     */
    selectAll,
    /**
     * Deselects all assets within the provided subset.
     */
    deselectAll,
    /**
     * Clears all selected assets, regardless of the current subset.
     */
    clearSelectedAssets,
    /**
     * Checks whether all assets in the current subset are selected.
     *
     * @returns `true` if all assets in the subset are selected, otherwise `false`.
     */
    isAllSelected,
    /**
     * Checks whether all assets in the current subset are selected.
     *
     * @returns `true` if all assets in the subset are selected, otherwise `false`.
     */
    isSelected,
    /**
     * Toggles the selection state of an asset.
     *
     * If the asset is currently selected, it will be deselected.
     * If it is not selected, it will be added to the selection.
     *
     * @param asset - The asset or its URI.
     */
    toggleSelect,
    /**
     * Checks whether at least one asset in the subset is selected.
     *
     * @returns `true` if at least one asset in the subset is selected, otherwise `false`.
     */
    isPartialSelected,
  };
}

function set(assets: GalleryAsset[]) {
  selectionStore.send({ type: 'setSelectedAssets', assets });
}

function clear() {
  selectionStore.send({ type: 'clearSelectedAssets' });
}

function add(assets: GalleryAsset[]) {
  selectionStore.send({ type: 'addSelectedAsset', assets });
}

function subtract(assets: GalleryAsset[]) {
  selectionStore.send({ type: 'subtractSelectedAsset', assets });
}

export const manageSelectedAssets = { set, add, subtract, clear };
