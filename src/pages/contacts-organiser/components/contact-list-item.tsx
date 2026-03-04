import { scaleX } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

import { Anagram } from '@/components/anagram';
import {
  presentContactViewer,
  useContact,
  usePrivateContact,
} from '@/modules/contacts-kit/react';
import { Checkbox } from '@/ui/checkbox';
import { UiText } from '@/ui/ui-text';

type ContactListItemProps = {
  id: string;
  isSelected?: boolean;
  handleSelect?: (id: string) => void;
  type?: 'address-book' | 'private-contacts';
  searchQuery?: string;
};

function norm(s?: string) {
  return (s ?? '').toLowerCase().trim();
}
function onlyDigits(s?: string) {
  return (s ?? '').replace(/\D+/g, '');
}
function extractPhones(contact: any): string[] {
  const raw = Array.isArray(contact?.phoneNumbers) ? contact.phoneNumbers : [];
  return raw
    .map((p: any) =>
      typeof p === 'string' ? p : (p?.value ?? p?.number ?? '')
    )
    .filter(Boolean);
}

export function ContactListItem({
  id,
  isSelected,
  handleSelect,
  type = 'address-book',
  searchQuery = '',
}: ContactListItemProps) {
  const contactAddress = useContact(id);
  const contactPrivate = usePrivateContact(id);

  const contact = type === 'address-book' ? contactAddress : contactPrivate;

  if (!contact) return null;

  const q = norm(searchQuery);
  const qd = onlyDigits(searchQuery);

  const name = norm(contact.displayName || '');
  const phones = extractPhones(contact);
  const phoneDigits = phones.map(onlyDigits);

  const textHit = q ? name.includes(q) : false;
  const phoneHit =
    qd.length >= 3 ? phoneDigits.some((p) => p.includes(qd)) : false;
  const matches = !q && !qd ? true : textHit || phoneHit;

  if (!matches) return null;

  const phonesLine = phones.join(', ');

  return (
    <TouchableOpacity
      className="flex-row items-center gap-4 rounded-2.5xl bg-white px-4.5 py-5"
      onPress={() => {
        presentContactViewer({
          appearance: 'light',
          ...(type === 'address-book' ? { contactId: id } : { privateId: id }),
        });
      }}
    >
      <View
        className="rounded-full bg-primary"
        style={{
          width: scaleX(32),
          height: scaleX(32),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {contact.imageDataAvailable && contact.image?.thumbnail ? (
          <Image
            source={{ uri: contact.image.thumbnail }}
            className="size-10 rounded-full"
          />
        ) : (
          <Anagram contact={contact} className="size-10" />
        )}
      </View>

      <View className="flex-1 gap-1">
        <UiText className="w-full text-sm font-medium" numberOfLines={1}>
          {contact.displayName || '—'}
        </UiText>
        <UiText className="w-full text-xs text-gray" numberOfLines={1}>
          {phonesLine}
        </UiText>
      </View>

      <Checkbox checked={isSelected} onChange={() => handleSelect?.(id)} />
    </TouchableOpacity>
  );
}
