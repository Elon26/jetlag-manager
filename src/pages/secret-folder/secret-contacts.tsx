import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Layout } from '@/components/layout';
import { usePaywall } from '@/hooks/use-paywall';
import { useSheetPrompt } from '@/hooks/use-sheet-prompt';
import {
  createOrImportPrivateContact,
  deletePrivateContacts,
  usePrivateContactIds,
} from '@/modules/contacts-kit/react';
import { ButtonPrimary } from '@/ui/button-primary';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { scaleX } from '@kirz/nativewind-scale';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatContactsListView } from '../contacts-organiser/components/flat-contacts-list-view';
import { useSelectedContacts } from '../contacts-organiser/hooks/use-selected-contacts';

const FREE_LIMIT = 1;

export function SecretContacts() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const { ids, refetch, status } = usePrivateContactIds();

  const {
    selectedContacts,
    handleContactSelect,
    isContactSelected,
    selectAllContacts,
    deselectAllContacts,
    isAllSelected,
    setSelectedContacts,
    selectionMode,
    setSelectionMode,
  } = useSelectedContacts(ids);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() =>
            isAllSelected ? deselectAllContacts() : selectAllContacts()
          }
        >
          <UiText className="w-16 text-sm color-text">
            {isAllSelected
              ? t('timezone.cancel')
              : t('secret-folder.contacts.select-all')}
          </UiText>
        </Pressable>
      ),
    });
  }, [navigation, selectAllContacts, deselectAllContacts, isAllSelected, t]);

  useEffect(() => {
    setSelectionMode(true);
    deselectAllContacts();
    return () => {
      setSelectionMode(false);
      deselectAllContacts();
    };
  }, [setSelectionMode, deselectAllContacts]);

  const limit = hasPremium ? undefined : Math.max(FREE_LIMIT - ids.length, 0);

  const handleAddContact = async () => {
    setLoading(true);
    try {
      const result = await createOrImportPrivateContact({
        limit,
      });
      await refetch();
      if (result.error === 'limit exceeded') {
        showPaywall();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContacts = async () => {
    if (selectedContacts.size === 0) return;

    setLoading(true);
    try {
      const result = await restoreAfterDeletePrompt();
      if (result === undefined) return;
      if (result === false) {
        await deletePrivateContacts(
          Array.from(selectedContacts),
          async () => true
        );
        setSelectedContacts(new Set<string>());
        await refetch();
      }
    } catch (error) {
      console.error('Error deleting contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ids.length === 0) {
      setSelectionMode(false);
    }
  }, [ids.length, setSelectionMode]);

  const {
    prompt: removeAfterImportPrompt,
    SheetPromptComponent: SheetPromptRemoveAfterImport,
  } = useSheetPrompt({
    title: t('secret-folder.contacts.remove-after-import.title'),
    description: t('secret-folder.contacts.remove-after-import.description'),
    actions: [{ label: t('cleaner.delete'), value: true }],
    cancelLabel: t('timezone.later'),
  });

  const {
    prompt: restoreAfterDeletePrompt,
    SheetPromptComponent: SheetPromptRestoreAfterDelete,
  } = useSheetPrompt({
    title: t('secret-folder.contacts.confirm-delete.title'),
    description: t('secret-folder.contacts.confirm-delete.description'),
    actions: [{ label: t('cleaner.delete'), value: false }],
  });

  useEffect(() => {
    return () => {
      setSelectedContacts(new Set<string>());
    };
  }, [setSelectedContacts]);

  return (
    <Layout className=" bg-[#F5F5F5] px-4">
      <View
        style={{ height: scaleX(55) + insets.top }}
        className="absolute inset-x-0 bg-white"
      />
      <FlatContactsListView
        data={ids}
        handleContactSelect={handleContactSelect}
        isContactSelected={isContactSelected}
        isRefreshing={status === 'loading'}
        refresh={refetch}
        selectionMode={selectionMode}
        type="private-contacts"
      />
      <View className="absolute inset-x-0 bottom-0 rounded-3xl border border-[#EEEEEE] bg-white px-5 pb-13 pt-6">
        {selectedContacts.size === 0 ? (
          <ButtonPrimary
            className="h-14 w-full"
            disabled={loading}
            label={t('secret-folder.contacts.add-contact-button')}
            loading={loading}
            onPress={handleAddContact}
          />
        ) : (
          <ButtonPrimary
            className="h-14 w-full"
            disabled={loading}
            label={t('cleaner.delete')}
            loading={loading}
            onPress={handleDeleteContacts}
          />
        )}
      </View>

      <SheetPromptRemoveAfterImport />
      <SheetPromptRestoreAfterDelete />
    </Layout>
  );
}
