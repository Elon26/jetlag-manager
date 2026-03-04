import type { ModalStackParams } from '@/components/modals';
import { useModal } from 'react-native-modalfy';

export function useModals() {
  return useModal<ModalStackParams>();
}
