import { scaleY } from '@kirz/nativewind-scale';
import { router, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Layout } from '@/components/layout';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorageValue } from '@/hooks/use-storage';
import ArrowLeftIcon from '@/svg/back.svg';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

import SearchArea from './components/search-area';
import TimeZoneFooter from './components/timezone-footer';
import TimezonesArea from './components/timezones-area';
import { TimezoneObj } from './types/timezone-obj';

export default function TimeZoneTimePage() {
  const { width } = useWindowDimensions();
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const { t } = useTranslation();
  const { openModal, closeModal } = useModals();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const savedTimezones = useStorageValue('savedTimezones');

  const [searchText, setSearchText] = useState('');
  const [filteredTimezones, setFilteredTimezones] = useState(savedTimezones);

  function handleAdd(savedTimezones: TimezoneObj[]) {
    if (!hasPremium && savedTimezones.length >= 3) {
      showPaywall();
      return;
    }
    if (savedTimezones.length >= 10) {
      Alert.alert(t('timezone.more-than-ten'));
      return;
    }
    openModal('CreateTimezoneModal', {
      close: () => closeModal('CreateTimezoneModal'),
      maxPriority: savedTimezones.length + 1,
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => handleAdd(savedTimezones)}>
          <SfSymbol className="size-4 color-text" name="plus" weight="bold" />
        </Pressable>
      ),
      headerLeft: () => {
        return (
          <View className="flex-row gap-x-2">
            <Pressable onPress={() => router.navigate('/main')}>
              <ArrowLeftIcon />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation, savedTimezones]);

  useEffect(() => {
    const result = savedTimezones.filter((item) =>
      item.timezone.label.toLowerCase().includes(searchText.toLowerCase())
    );
    result.sort((x, y) => x.priority - y.priority);
    setFilteredTimezones(result);
  }, [savedTimezones, searchText]);

  return (
    <Layout className="flex-1 gap-y-2.5 overflow-visible px-4">
      <View className="flex-1 gap-y-4">
        <SearchArea searchText={searchText} setSearchText={setSearchText} />
        <View className="flex-1 pb-10">
          {filteredTimezones.length ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: insets.bottom || scaleY(32),
              }}
              className="overflow-visible"
            >
              <TimezonesArea
                filteredTimezones={filteredTimezones}
                currentTimeShift={width}
              />
            </ScrollView>
          ) : (
            <View>
              <UiText className="text-center font-bold">
                {t('timezone.no-timezones')}
              </UiText>
            </View>
          )}
        </View>
      </View>

      <TimeZoneFooter />
    </Layout>
  );
}
