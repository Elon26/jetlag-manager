import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { usePrivateContactIds } from '@/modules/contacts-kit/react';
import { useSecretFolderGallery } from '@/pages/secret-folder/hooks/use-secret-folder-gallery';
import { useSecretPasswords } from '@/pages/secret-folder/hooks/use-secret-passwords';
import ContactsIcon from '@/svg/main/contacts.svg';
import GalleryIcon from '@/svg/main/gallery.svg';
import PasswordsIcon from '@/svg/main/passwords.svg';
import SecretFolderIcon from '@/svg/main/secret-folder.svg';

import { SquareWidget } from './square-widget';

type SecretFolderProps = {
  locked?: boolean;
};

export function SecretFolderWidget({ locked = false }: SecretFolderProps) {
  const { ids: contactIds } = usePrivateContactIds();
  const { assets } = useSecretFolderGallery();
  const { passwords } = useSecretPasswords();
  const { t } = useTranslation();
  return (
    <SquareWidget
      title={t('secret-folder.widget.title')}
      icon={SecretFolderIcon}
      onPress={() => router.navigate('/secret-folder')}
      locked={locked}
      stats={[
        { value: assets?.length ?? 0, Icon: GalleryIcon },
        { value: contactIds?.length ?? 0, Icon: ContactsIcon },
        { value: passwords?.length ?? 0 ?? 0, Icon: PasswordsIcon },
      ]}
    />
  );
}
