import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import ContactsIcon from '@/svg/main/contacts.svg';
import ContactsOrganiserIcon from '@/svg/main/contacts-organiser.svg';

import { SquareWidget } from './square-widget';

export function ContactsOrganiserWidgetLock() {
  const { t } = useTranslation();
  return (
    <SquareWidget
      title={t('cleaner.contacts-organiser.widget.title')}
      icon={ContactsOrganiserIcon}
      onPress={() => router.navigate('/contacts-organiser')}
      locked={true}
      stats={[{ value: '-', Icon: ContactsIcon }]}
    />
  );
}
