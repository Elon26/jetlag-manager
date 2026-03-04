import { createStore } from '@xstate/store';
import { difference } from 'remeda';

export const selectionStore = createStore({
  context: {
    selectedAssets: [] as string[],
  },
  on: {
    SELECT_ASSET: (context, event: { assetUri: string }) => {
      return {
        ...context,
        selectedAssets: [...context.selectedAssets, event.assetUri],
      };
    },
    DESELECT_ASSET: (context, event: { assetUri: string }) => {
      return {
        ...context,
        selectedAssets: context.selectedAssets.filter((uri) => uri !== event.assetUri),
      };
    },
    CLEAR_SELECTION: (context) => {
      return {
        ...context,
        selectedAssets: [],
      };
    },
    TOGGLE_ASSET_SELECTION: (context, event: { assetUri: string }) => {
      const isSelected = context.selectedAssets.includes(event.assetUri);
      return {
        ...context,
        selectedAssets: isSelected
          ? context.selectedAssets.filter((uri) => uri !== event.assetUri)
          : [...context.selectedAssets, event.assetUri],
      };
    },
    SET_SELECTION: (context, event: { assetUris: string[] }) => {
      return {
        ...context,
        selectedAssets: event.assetUris,
      };
    },
    SELECT_GROUP: (context, event: { assetUris: string[] }) => {
      const diff = difference(event.assetUris, context.selectedAssets);
      return {
        ...context,
        selectedAssets: [...context.selectedAssets, ...diff],
      };
    },
    DESELECT_GROUP: (context, event: { assetUris: string[] }) => {
      const diff = difference(context.selectedAssets, event.assetUris);
      return {
        ...context,
        selectedAssets: diff,
      };
    },
  },
});
