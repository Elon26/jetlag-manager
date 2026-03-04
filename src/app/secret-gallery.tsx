import { withAuthenticationRequired } from 'expo-with-pincode';

import { SecretGallery } from '@/pages/secret-folder/gallery';

function SecretGalleryScreen() {
  return <SecretGallery />;
}

export default withAuthenticationRequired(SecretGalleryScreen);
