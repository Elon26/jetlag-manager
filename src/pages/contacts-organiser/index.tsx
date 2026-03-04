import { Layout } from '@/components/layout';
import { useModals } from '@/hooks/use-modals';
import { usePaywall } from '@/hooks/use-paywall';
import { usePermissionAlert } from '@/hooks/use-permission-alert';
import { useSheetPrompt } from '@/hooks/use-sheet-prompt';
import {
  mergeContacts,
  useContactIds,
  useContactsSimilarByField,
} from '@/modules/contacts-kit/react';
import {
  type SimilarityField,
  SimilarityFields,
} from '@/modules/contacts-kit/react/constants';

import { Loader } from '@/components/scan-loader';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';
import { scaleX } from '@kirz/nativewind-scale';
import * as Contacts from 'expo-contacts';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheetIOS, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroupContactsListView } from './components/group-contacts-list-view';
import { TabButton } from './components/tab-button';
import { useSelectedContacts } from './hooks/use-selected-contacts';

const normalize = (s: string) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const onlyDigits = (s: string) => (s ?? '').replace(/\D+/g, '');

function useContactsSearchIds(query: string) {
  const deferred = useDeferredValue(query);
  const [matched, setMatched] = useState<Set<string> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const q = normalize(deferred);
      const qDigits = onlyDigits(deferred);

      if (!q && !qDigits) {
        if (!cancelled) setMatched(null);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        pageSize: 5000,
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.Emails,
          Contacts.Fields.PhoneNumbers,
        ],
      });

      const ids = new Set<string>();
      for (const c of data) {
        const name = normalize(`${c.name ?? ''}`);
        const emails = normalize(
          (c.emails ?? []).map((e) => e.email ?? '').join(' ')
        );
        const phonesJoined = (c.phoneNumbers ?? [])
          .map((p) => p.number ?? '')
          .join(' ');
        const phonesDigits = onlyDigits(phonesJoined);

        const nameHit = q && name.includes(q);
        const emailHit = q && emails.includes(q);
        const phoneHit = qDigits.length >= 2 && phonesDigits.includes(qDigits);

        if (nameHit || emailHit || phoneHit) ids.add(c.id as string);
      }

      if (!cancelled) setMatched(ids);
    };

    const t = setTimeout(run, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [deferred]);

  return matched;
}

export function ContactsOrganiser() {
  const { t } = useTranslation();

  usePermissionAlert(
    'ios.permission.CONTACTS',
    t('cleaner.contacts-organiser.permission-alert')
  );

  const { premiumAction } = usePaywall();

  const { folder } = useLocalSearchParams<{ folder?: string }>();
  const originSmartCleaner = Object.keys(SimilarityFields).includes(
    folder as SimilarityField
  );

  const initialTab = originSmartCleaner ? (folder as SimilarityField) : 'name';
  const [activeTab, setActiveTab] = useState<SimilarityField>(initialTab);
  const [internalActiveTab, setInternalActiveTab] =
    useState<SimilarityField>(initialTab);

  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModals();

  const {
    ids: allIds,
    status: allStatus,
    refetch: refetchAll,
  } = useContactIds();

  const {
    idGroups: similarIds,
    status: similarStatus,
    refetch: refetchSimilar,
  } = useContactsSimilarByField(internalActiveTab);

  const searchMatchedIds = useContactsSearchIds(searchQuery);

  const filteredGroups = useMemo(() => {
    if (!searchMatchedIds) return similarIds;

    return similarIds
      .map((g) => g.filter((id) => searchMatchedIds.has(id)))
      .filter((g) => g.length > 1);
  }, [similarIds, searchMatchedIds]);

  const {
    selectedContacts,
    handleContactSelect,
    isContactSelected,
    selectAllContacts,
    deselectAllContacts,
    isAllSelected,
    setSelectedContacts,
    setSelectionMode,
  } = useSelectedContacts(allIds);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          className="w-18 items-end rounded-xl bg-[#FFFFFF70]"
          onPress={() =>
            isAllSelected ? deselectAllContacts() : selectAllContacts()
          }
        >
          <UiText className="text-sm  color-text">
            {isAllSelected
              ? t('timezone.cancel')
              : t('cleaner.contacts-organiser.check-all')}
          </UiText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectAllContacts, deselectAllContacts, isAllSelected, t]);

  const resultRef = useRef(0);

  const mergeGroup = premiumAction(() => {
    const mergeableGroups: string[][] = [];
    for (const group of similarIds) {
      const g = group.filter((id) => selectedContacts.has(id));
      if (g.length > 1) mergeableGroups.push(g);
    }
    if (mergeableGroups.length === 0) return;
    resultRef.current = mergeableGroups.flat().length - mergeableGroups.length;
    handleMerge(mergeableGroups);
  });

  const [sheetPromptDescription, setSheetPromptDescription] = useState('');
  const { prompt: promptMerge, SheetPromptComponent } = useSheetPrompt({
    title: t('cleaner.contacts-organiser.merge-contacts.title'),
    description: sheetPromptDescription,
    actions: [
      {
        label: t('cleaner.contacts-organiser.merge-contacts.action'),
        value: true,
      },
    ],
  });

  const handleMerge = async (groups: string[][]) => {
    if (groups.length === 0) return;

    setSheetPromptDescription(
      t('cleaner.contacts-organiser.merge-contacts.description', {
        total: groups.flat().length,
        groups: groups.length,
        contactWord: groups.length === 1 ? 'contact' : 'contacts',
      })
    );
    const doMerge = await promptMerge();
    if (doMerge) {
      openModal('CleaningModal');
      try {
        await mergeContacts(groups);
        deselectAllContacts();
        closeModal('CleaningModal');
        openModal('CleanerHappyModal', {
          children: (
            <UiText className="text-center text-sm text-gray">
              <UiText className="text-lg font-semibold text-primary">
                {resultRef.current}{' '}
                {t('cleaner.contacts-organiser.merge-success.contact', {
                  count: resultRef.current,
                })}
              </UiText>{' '}
              {t('cleaner.contacts-organiser.merge-success.message')}
            </UiText>
          ),
        });
      } catch (error) {
        closeModal('CleaningModal');
        console.error('Error merging contacts:', error);
      }
    }
  };

  const handleDeleteContacts = premiumAction(async () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          t('timezone.cancel'),
          t('cleaner.contacts-organiser.delete-contacts.action', {
            count: selectedContacts.size,
          }),
        ],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        title: t('cleaner.contacts-organiser.delete-contacts.title'),
        message: t('cleaner.contacts-organiser.delete-contacts.message', {
          count: selectedContacts.size,
        }),
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          try {
            const count = selectedContacts.size;
            await Promise.all(
              Array.from(selectedContacts).map(async (id) => {
                try {
                  await Contacts.removeContactAsync(id);
                } catch (e) {
                  console.warn(`Failed to remove contact ${id}:`, e);
                }
              })
            );

            deselectAllContacts();

            openModal('CleanerHappyModal', {
              children: (
                <UiText className="text-center">
                  <UiText>
                    {count}{' '}
                    {t('cleaner.contacts-organiser.delete-success.files')}{' '}
                    {t('cleaner.contacts-organiser.delete-success.take-up')}{' '}
                    {count}{' '}
                    {t('cleaner.contacts-organiser.delete-success.item', {
                      count: count,
                    })}
                  </UiText>
                </UiText>
              ),
            });
          } catch (error) {
            console.error('Error deleting contacts:', error);
          } finally {
          }
        }
      }
    );
  });

  useEffect(() => {
    setSelectionMode(true);
    if (originSmartCleaner) return () => {};
    deselectAllContacts();
    return () => {
      setSelectionMode(false);
      deselectAllContacts();
    };
  }, [setSelectionMode, deselectAllContacts, originSmartCleaner]);

  const handleTabPress = (tab: SimilarityField) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSelectedContacts(new Set<string>());
    setTimeout(() => {
      setInternalActiveTab(tab);
    }, 10);
  };

  const groupBy: 'name' | 'phone' =
    internalActiveTab === 'phone' ? 'phone' : 'name';

  return (
    <Layout className="px-0">
      <View
        style={{ height: scaleX(110) + insets.top }}
        className="absolute inset-x-0 bg-white"
      />
      <View className="flex-row flex-wrap items-center justify-between gap-2 px-4 py-2 ">
        <TabButton
          active={activeTab === 'name'}
          onPress={() => handleTabPress('name')}
          title={t('cleaner.contacts-organiser.tabs.duplicate-names')}
        />
        <TabButton
          active={activeTab === 'phone'}
          onPress={() => handleTabPress('phone')}
          title={t('cleaner.contacts-organiser.tabs.duplicate-numbers')}
        />
      </View>
      {similarStatus === 'loading' ? (
        <Loader />
      ) : (
        <>
          <Animated.View
            className="flex-1 px-5"
            entering={FadeIn}
            exiting={FadeOut}
          >
            <GroupContactsListView
              data={filteredGroups}
              handleContactSelect={handleContactSelect}
              isContactSelected={isContactSelected}
              isRefreshing={similarStatus === 'idle'}
              refresh={refetchSimilar}
              groupBy={groupBy}
            />
          </Animated.View>
          <View className="absolute inset-x-0 bottom-0 rounded-3xl border border-[#EEEEEE] bg-white px-5 pb-8 pt-6">
            <ButtonPrimary
              className="mb-5 h-14 w-full "
              label={
                originSmartCleaner
                  ? t('cleaner.gallery-album.continue-button')
                  : t('cleaner.contacts-organiser.merge-button')
              }
              disabled={selectedContacts.size === 0}
              onPress={() => {
                if (originSmartCleaner) {
                  router.back();
                  return;
                }
                mergeGroup();
              }}
            />
          </View>
        </>
      )}

      <SheetPromptComponent />
    </Layout>
  );
}
