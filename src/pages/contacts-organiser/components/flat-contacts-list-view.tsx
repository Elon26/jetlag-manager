import { scaleX } from '@kirz/nativewind-scale';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { EmptyList } from '@/components/empty-list';
import { Loader } from '@/components/scan-loader';
import EmptyContacts from '@/images/secret-folder/empty-contacts.png';
import { useContact, usePrivateContact } from '@/modules/contacts-kit/react';
import { UiText } from '@/ui/ui-text';

import { ContactListItem } from './contact-list-item';

type FlatContactsListViewProps = {
  data: string[];
  isContactSelected: (id: string) => boolean;
  handleContactSelect: (id: string) => void;
  refresh: () => void;
  searchQuery?: string;
  isRefreshing: boolean;
  type?: 'address-book' | 'private-contacts';
  selectionMode?: boolean;
};

type ListItem =
  | { type: 'header'; title: string; key: string }
  | { type: 'contact'; id: string; key: string };

function getFirstLetter(name: string) {
  const trimmed = (name || '').trim();
  if (!trimmed) return '#';

  const ch = trimmed[0]!.toUpperCase();
  // только буквы/цифры — иначе в "#"
  if (!/^[A-ZА-ЯЁ0-9]$/u.test(ch)) return '#';
  return ch;
}

function buildFlatItems(ids: string[], getName: (id: string) => string) {
  const sorted = [...ids].sort((a, b) =>
    getName(a).localeCompare(getName(b), 'ru', { sensitivity: 'base' })
  );

  const result: ListItem[] = [];
  let last = '';

  for (const id of sorted) {
    const letter = getFirstLetter(getName(id));
    if (letter !== last) {
      result.push({ type: 'header', title: letter, key: `h-${letter}-${id}` });
      last = letter;
    }
    result.push({ type: 'contact', id, key: `c-${id}` });
  }

  return result;
}

function NamePrefetcher({
  id,
  type,
  onName,
}: {
  id: string;
  type: 'address-book' | 'private-contacts';
  onName: (id: string, name: string) => void;
}) {
  const c1 = useContact(id);
  const c2 = usePrivateContact(id);
  const c = type === 'address-book' ? c1 : c2;

  useEffect(() => {
    onName(id, c?.displayName ?? '');
  }, [id, c?.displayName, onName]);

  return null;
}

export function FlatContactsListView({
  data,
  isContactSelected,
  handleContactSelect,
  searchQuery = '',
  refresh,
  isRefreshing,
  type = 'address-book',
}: FlatContactsListViewProps) {
  const [nameById, setNameById] = useState<Record<string, string>>({});

  const handleName = useMemo(
    () => (id: string, name: string) => {
      setNameById((prev) => {
        if (prev[id] === name) return prev;
        return { ...prev, [id]: name };
      });
    },
    []
  );

  // функция имени (без хуков) — берём из кеша
  const getName = useMemo(() => {
    return (id: string) => nameById[id] ?? '';
  }, [nameById]);

  const flatData = useMemo(
    () => buildFlatItems(data, getName),
    [data, getName]
  );

  return (
    <FlatList
      alwaysBounceVertical={false}
      className="mb-25 flex-1 pt-5"
      contentContainerClassName="gap-2 min-h-full"
      data={flatData}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={() => (
        <View>
          {data.map((id) => (
            <NamePrefetcher
              key={`pf-${id}`}
              id={id}
              type={type}
              onName={handleName}
            />
          ))}
        </View>
      )}
      ListEmptyComponent={() =>
        isRefreshing ? (
          <Loader />
        ) : (
          <EmptyList
            image={EmptyContacts}
            imageStyle={{ width: scaleX(271), height: scaleX(242) }}
            textClassName="pt-1"
            text="Add your contact"
          />
        )
      }
      onRefresh={refresh}
      refreshing={isRefreshing}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return (
            <View className="px-5 pt-2">
              <UiText className=" font-semibold text-text">{item.title}</UiText>
            </View>
          );
        }

        return (
          <ContactListItem
            handleSelect={handleContactSelect}
            id={item.id}
            isSelected={isContactSelected(item.id)}
            searchQuery={searchQuery}
            type={type}
          />
        );
      }}
    />
  );
}
