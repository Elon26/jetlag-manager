import { withAuthenticationRequired } from 'expo-with-pincode';

import { SecretContacts } from '@/pages/secret-folder/secret-contacts';

function SecretContactsScreen() {
  return <SecretContacts />;
}

export default withAuthenticationRequired(SecretContactsScreen);
