import { Checkbox } from '@/ui/checkbox';
import type { ThumbnailOverlayComponentProps } from 'expo-simple-gallery';

export function ThumbnailOverlayComponent({
  selected,
}: ThumbnailOverlayComponentProps) {
  return (
    <Checkbox
      checked={selected}
      className="pointer-events-none absolute left-20 top-2 rounded-md border-[#FDFDFD] p-2 shadow-md shadow-black/30 "
    />
  );
}
