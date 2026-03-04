import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyList } from '@/components/empty-list';
import { Layout } from '@/components/layout';
import type { ModalStackParams } from '@/components/modals';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorage } from '@/hooks/use-storage';
import EmptyPasswords from '@/images/secret-folder/empty-passwords.png';
import { ButtonPrimary } from '@/ui/button-primary';
import { uuid } from '@/utils/uuid';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { HeaderMenu } from './components/header-menu';
import { PasswordListItem } from './components/password-list-item';
import { useEnableAutofillSheet } from './components/use-enable-autofill-sheet';
import {
  deletePassword,
  useSecretPasswords,
} from './hooks/use-secret-passwords';
import type { Password } from './hooks/use-secret-passwords/types';

const FREE_LIMIT = 1;

export function SecretPasswords() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const modal = useModal<ModalStackParams>();

  const { passwords, autofillEnabled } = useSecretPasswords();
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();

  const [autofillGuideShown, setAutofillGuideShown] =
    useStorage('autofillGuideShown');

  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Password[]>([]);

  const { present: presentAutofillSheet, SheetModalComponent: AutofillSheet } =
    useEnableAutofillSheet();

  useEffect(() => {
    const safePasswords = passwords ?? [];

    navigation.setOptions({
      headerRight: () => (
        <HeaderMenu
          selectionMode={selectionMode}
          isNoneSelected={selected.length === 0}
          isAllSelected={
            safePasswords.length > 0 && selected.length === safePasswords.length
          }
          onSelect={() => {
            if (!safePasswords.length) return;
            setSelectionMode(true);
          }}
          onSelectAll={() => {
            if (!safePasswords.length) return;
            setSelectionMode(true);
            setSelected(safePasswords);
          }}
          onUnselectAll={() => {
            setSelected([]);
            setSelectionMode(false);
          }}
        />
      ),
    });
  }, [navigation, passwords, selected, selectionMode]);

  useEffect(() => {
    if (autofillEnabled !== true && !autofillGuideShown) {
      requestAnimationFrame(() => presentAutofillSheet());
      setAutofillGuideShown(true);
    }
  }, [
    autofillEnabled,
    autofillGuideShown,
    presentAutofillSheet,
    setAutofillGuideShown,
  ]);

  const handleDelete = () => {
    Alert.alert(
      t('secret-folder.passwords.delete-multiple.title'),
      t('secret-folder.passwords.delete-multiple.description'),
      [
        { text: t('timezone.cancel'), style: 'cancel' },
        {
          text: t('basic.delete'),
          style: 'destructive',
          onPress: () => {
            selected.forEach(deletePassword);
            setSelected([]);
            setSelectionMode(false);
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    if (!hasPremium && FREE_LIMIT <= (passwords?.length ?? 0)) {
      showPaywall();
      return;
    }
    modal.openModal('SecretPasswordModal');
  };

  const isSelected = (id: string) => selected.some((p) => p.id === id);

  const handleSelect = (item: Password, checked: boolean) => {
    setSelected((prev) => {
      if (checked) {
        return prev.some((p) => p.id === item.id) ? prev : [...prev, item];
      }
      return prev.filter((p) => p.id !== item.id);
    });
  };

  const handleDeleteOne = (item: Password) => {
    Alert.alert(
      t('secret-folder.passwords.delete-single.title'),
      t('secret-folder.passwords.delete-single.description'),
      [
        { text: t('timezone.cancel'), style: 'cancel' },
        {
          text: t('cleaner.delete'),
          style: 'destructive',
          onPress: () => {
            deletePassword(item);
            setSelected((prev) => prev.filter((p) => p.id !== item.id));
          },
        },
      ]
    );
  };

  return (
    <Layout className="bg-[#F5F5F5] px-4">
      <View
        className="absolute inset-x-0 bg-white"
        style={{ height: insets.top + scaleY(60) }}
      />

      {!passwords?.length ? (
        <EmptyList
          text={t('secret-folder.passwords.empty-state')}
          image={EmptyPasswords}
          imageStyle={{ width: scaleX(343), height: scaleX(212) }}
        />
      ) : (
        <FlatList
          data={passwords}
          keyExtractor={(item) => item.id ?? uuid()}
          contentContainerStyle={{
            paddingTop: scaleY(16),
            paddingBottom: scaleY(186),
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <PasswordListItem
              item={item}
              selectionMode={selectionMode}
              selected={isSelected(item.id)}
              onSelect={(id, checked) => handleSelect(item, checked)}
              onDelete={handleDeleteOne}
            />
          )}
        />
      )}

      <View className="absolute inset-x-0 bottom-0 rounded-3xl border border-[#EEEEEE] bg-white px-5 pb-13 pt-6">
        {selectionMode ? (
          <ButtonPrimary
            className="h-14 flex-1"
            disabled={selected.length === 0}
            label={t('cleaner.delete')}
            onPress={handleDelete}
            style={{
              shadowColor: '#FF4D4F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
            }}
          />
        ) : (
          <ButtonPrimary
            className="h-14 flex-1"
            label={t('secret-folder.passwords.add-password-button')}
            onPress={handleAddNew}
            style={{
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
            }}
          />
        )}
      </View>
      <AutofillSheet />
    </Layout>
  );
}
