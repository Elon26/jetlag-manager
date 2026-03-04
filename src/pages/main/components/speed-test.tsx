import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import { useSpeedTest } from '@/hooks/use-speedtest';
import DownloadIcon from '@/svg/main/download.svg';
import SpeedTestIcon from '@/svg/main/speed-test.svg';
import UploadIcon from '@/svg/main/upload.svg';

import { SquareWidget } from './square-widget';

type SpeedTestWidgetProps = {
  locked?: boolean;
};

export function SpeedTestWidget({ locked = false }: SpeedTestWidgetProps) {
  const { resultsAtom } = useSpeedTest();
  const results = useAtomValue(resultsAtom);
  const { t } = useTranslation();

  const download = results.download ? results.download.toFixed(0) : '--';

  const upload = results.upload ? results.upload.toFixed(0) : '--';

  return (
    <SquareWidget
      title={t('speed-test.widget.title')}
      icon={SpeedTestIcon}
      onPress={() => router.navigate('/speed-test')}
      locked={locked}
      stats={[
        { value: upload, Icon: UploadIcon },
        { value: download, Icon: DownloadIcon },
      ]}
    />
  );
}
