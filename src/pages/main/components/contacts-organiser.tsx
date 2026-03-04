import * as Contacts from 'expo-contacts';
import { router } from 'expo-router';
import numbro from 'numbro';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useContactIds } from '@/modules/contacts-kit/react';
import ContactsIcon from '@/svg/main/contacts.svg';
import ContactsOrganiserIcon from '@/svg/main/contacts-organiser.svg';

import { SquareWidget } from './square-widget';

export function ContactsOrganiserWidget() {
  const { ids, status } = useContactIds();
  const { t } = useTranslation();
  const isLoading = status === 'loading' || !ids;
  const [contactsText, setContactsText] = useState('...');
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    (async () => {
      const perm = await Contacts.getPermissionsAsync();
      if (perm.status === 'granted') {
        setLocked(false);
      } else {
        setLocked(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoading) {
      setContactsText('...');
    } else {
      setContactsText(
        `${numbro(ids.length).format({ thousandSeparated: true })}`
      );
    }
  }, [isLoading, ids?.length]);

  return (
    <SquareWidget
      title={t('cleaner.contacts-organiser.widget.title')}
      icon={ContactsOrganiserIcon}
      onPress={() => router.navigate('/contacts-organiser')}
      locked={locked}
      stats={[{ value: contactsText, Icon: ContactsIcon }]}
    />
  );
}
