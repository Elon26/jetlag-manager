import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

type PrioritySelectorProps = {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export default function SearchArea({
  searchText,
  setSearchText,
}: PrioritySelectorProps) {
  const { t } = useTranslation();

  return (
    <View>
      <TextInput
        className="h-10 rounded-lg bg-[#F5F5F5] pl-12 pr-4 text-xs"
        placeholder={t('timezone.search')}
        value={searchText}
        onChangeText={setSearchText}
      />
      <View className="absolute left-4 top-2">
        <View className="size-6 rounded-full border border-gray" />
        <View className="absolute bottom-[1px] right-0 h-[1px] w-1.5 rotate-45 bg-gray" />
      </View>
    </View>
  );
}
