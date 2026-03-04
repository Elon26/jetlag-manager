import { Env } from '@kirz/expo-env';
import { useTranslation } from 'react-i18next';

import { UiText } from '@/ui/ui-text';

import { useWebViewModal } from '../../hooks/use-web-view-modal';

export function PaywallFooter() {
  const { t } = useTranslation();
  const { openModal: openWebViewModal } = useWebViewModal();

  return (
    <UiText className="self-center text-sm opacity-60 color-white">
      <UiText
        className="text-sm underline color-white"
        onPress={() => {
          openWebViewModal(Env.TERMS_OF_USE);
        }}
      >
        {t('about.settings.terms-of-use')}
      </UiText>{' '}
      &{' '}
      <UiText
        className="text-sm underline color-white"
        onPress={() => {
          openWebViewModal(Env.PRIVACY_POLICY);
        }}
      >
        {t('about.settings.privacy-policy')}
      </UiText>
    </UiText>
  );
}
