import { withAuthenticationRequired } from 'expo-with-pincode';

import { SecretPasswords } from '@/pages/secret-folder/passwords';

function SecretPasswordsScreen() {
  return <SecretPasswords />;
}

export default withAuthenticationRequired(SecretPasswordsScreen);
