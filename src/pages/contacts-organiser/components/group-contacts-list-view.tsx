import { scaleY } from '@kirz/nativewind-scale';
import { FlatList, View } from 'react-native';

import { EmptyList } from '@/components/empty-list';
import { useContact } from '@/modules/contacts-kit/react';
import { UiText } from '@/ui/ui-text';

import { ContactListItem } from './contact-list-item';

type ContactListViewProps = {
  data: string[][];
  isContactSelected: (id: string) => boolean;
  handleContactSelect: (id: string) => void;
  refresh: () => void;
  isRefreshing: boolean;
  type?: 'address-book' | 'private-contacts';
  groupBy: 'name' | 'phone';
};

type ContactsGroupItemProps = {
  group: string[];
  isContactSelected: (id: string) => boolean;
  handleContactSelect: (id: string) => void;
  type: 'address-book' | 'private-contacts';
  groupBy: 'name' | 'phone';
};

export function GroupContactsListView({
  data,
  isContactSelected,
  handleContactSelect,
  refresh,
  isRefreshing,
  type = 'address-book',
  groupBy,
}: ContactListViewProps) {
  return (
    <FlatList
      alwaysBounceVertical={false}
      className="flex-1"
      contentContainerClassName="gap-1 min-h-full"
      contentContainerStyle={{ paddingBottom: scaleY(175) }}
      data={data}
      keyExtractor={(group) => group[0]}
      ListEmptyComponent={() => <EmptyList text="Nothing to clean here." />}
      onRefresh={refresh}
      refreshing={isRefreshing}
      renderItem={({ item }) => (
        <ContactsGroupItem
          group={item}
          isContactSelected={isContactSelected}
          handleContactSelect={handleContactSelect}
          type={type}
          groupBy={groupBy}
        />
      )}
    />
  );
}

function ContactsGroupItem({
  group,
  isContactSelected,
  handleContactSelect,
  type,
  groupBy,
}: ContactsGroupItemProps) {
  const firstContact = useContact(group[0]);

  const headerLabel =
    groupBy === 'phone'
      ? (firstContact?.phoneNumbers?.[0]?.value ?? 'Unknown number')
      : (firstContact?.displayName ?? 'Unnamed contact');

  const headerSubtitle = groupBy === 'phone' ? 'Phone number' : 'Contact name';

  return (
    <View>
      <View className="pb-2 pl-4 pt-5">
        <UiText className="font-medium">{headerLabel}</UiText>
        <UiText className="pt-1 text-xs color-gray">{headerSubtitle}</UiText>
      </View>

      {group.map((id) => (
        <ContactRowWithData
          key={id}
          id={id}
          type={type}
          isSelected={isContactSelected(id)}
          onSelect={handleContactSelect}
        />
      ))}
    </View>
  );
}

function ContactRowWithData({
  id,
  type,
  isSelected,
  onSelect,
}: {
  id: string;
  type: 'address-book' | 'private-contacts';
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  useContact(id);

  return (
    <View>
      <View className="h-3" />
      <ContactListItem
        id={id}
        type={type}
        isSelected={isSelected}
        handleSelect={onSelect}
      />
    </View>
  );
}

export default GroupContactsListView;
