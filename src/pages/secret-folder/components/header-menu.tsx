import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type HeaderMenuProps = {
  selectionMode: boolean;
  isAllSelected: boolean;
  isNoneSelected: boolean;
  onSelect: () => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  type?: 'gallery' | 'contacts' | 'passwords';
};

export function HeaderMenu({
  selectionMode,
  isAllSelected,
  onSelect,
  onSelectAll,
  onUnselectAll,
  type = 'gallery',
}: HeaderMenuProps) {
  const { t } = useTranslation();

  const getText = (key: 'select' | 'select-all' | 'unselect-all') => {
    if (type === 'contacts') {
      return t(`secret-folder.contacts.${key}`);
    } else if (type === 'passwords') {
      return t(`secret-folder.passwords.${key}`);
    }
    return t(`secret-folder.gallery.${key}`);
  };

  return (
    <View className="w-19 items-end">
      {!selectionMode && (
        <Pressable onPress={onSelect}>
          <UiText className="text-sm text-text">{getText('select')}</UiText>
        </Pressable>
      )}
      {selectionMode && !isAllSelected && (
        <Pressable onPress={onSelectAll}>
          <UiText className="text-sm text-text">{getText('select-all')}</UiText>
        </Pressable>
      )}

      {selectionMode && isAllSelected && (
        <Pressable onPress={onUnselectAll}>
          <UiText className="text-sm text-text">
            {getText('unselect-all')}
          </UiText>
        </Pressable>
      )}
    </View>
  );
}
