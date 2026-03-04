import { useEffect, useRef } from 'react';

import { useSheetModal } from '@/ui/sheet-modal';

import { EnableAutofillSheetContent } from './enable-autofill-bottom-sheet';

export function useEnableAutofillSheet() {
  const dismissRef = useRef<() => void>(() => {});

  const { present, dismiss, SheetModalComponent } = useSheetModal({
    children: (
      <EnableAutofillSheetContent dismiss={() => dismissRef.current()} />
    ),
    actions: [],
  });

  useEffect(() => {
    dismissRef.current = dismiss;
  }, [dismiss]);

  return { present, dismiss, SheetModalComponent };
}
