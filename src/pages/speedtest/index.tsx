import { Layout } from '@/components/layout';
import { shadows } from '@/config/theme';
import { useSpeedTest } from '@/hooks/use-speedtest';
import DownloadIcon from '@/svg/speed-test/download.svg';
import PingIcon from '@/svg/speed-test/ping.svg';
import UploadIcon from '@/svg/speed-test/upload.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SpeedTestArc } from './components/speed-test-arc';

type SpeedTestProps = {
  duration?: number;
  tests?: MeasureType[];
};

export type MeasureType = 'ping' | 'download' | 'upload';

const PING_HOST = '1.1.1.1';
const PING_TIMEOUT_MS = 1000;

async function startTestWithErrorHandling(
  start: (params?: SpeedTestProps) => Promise<void>,
  onError: () => void
) {
  try {
    await start({ tests: ['download', 'upload'] });
  } catch {
    onError();
    setTimeout(() => {
      startTestWithErrorHandling(start, onError);
    }, 1000);
  }
}

export function Speedtest() {
  const { t } = useTranslation();
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { start, ping, statusAtom, resultsAtom, progressAtom } = useSpeedTest();

  const speedtestStatus = useAtomValue(statusAtom);
  const result = useAtomValue(resultsAtom);
  const progress = useAtomValue(progressAtom);

  useEffect(() => {
    (async () => {
      try {
        await ping(PING_HOST, PING_TIMEOUT_MS);
      } catch {
        setShowModal(true);
      }
    })();
  }, [ping]);

  const handlePing = async () => {
    try {
      const times: number[] = [];
      for (let i = 0; i < 3; i++) {
        try {
          const ms = await ping(PING_HOST, PING_TIMEOUT_MS);
          if (Number.isFinite(ms)) times.push(ms);
        } catch {}
      }

      if (!times.length) throw new Error('PING_FAILED');

      const best = Math.round(Math.min(...times));
      setPingResult(String(best));
    } catch {
      setPingResult(null);
      setShowModal(true);
    }
  };

  const handleStart = async () => {
    await handlePing();
    if (!pingResult) {
      try {
        await ping(PING_HOST, PING_TIMEOUT_MS);
      } catch {
        setShowModal(true);
        return;
      }
    }

    await startTestWithErrorHandling(start, () => setShowModal(true));
    await handlePing();
  };

  const retryTest = async () => {
    setShowModal(false);
    try {
      await startTestWithErrorHandling(start, () => setShowModal(true));
      await handlePing();
    } catch {
      setShowModal(true);
    }
  };

  const buttonText = (() => {
    if (speedtestStatus === 'testing') {
      return t('speed-test.testing');
    } else if (result.download || result.upload) {
      return t('speed-test.test-again');
    } else {
      return t('speed-test.start-test');
    }
  })();

  return (
    <Layout className="-pb-safe-offset-10 flex-1 px-0">
      <View className="px-4 pt-5">
        <View
          className="mt-4 items-center justify-center rounded-3xl bg-white"
          style={shadows.md}
        >
          <SpeedTestArc />
        </View>

        <View className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center">
            <PingIcon />
            <UiText className="pl-2 text-lg font-medium">
              {t('speed-test.ping')}
            </UiText>
          </View>
          <View className="flex-row items-center">
            <UiText className="pr-1 text-1.5xl font-light text-gray opacity-70">
              {pingResult ?? '--.--'}
            </UiText>
            <UiText className="pt-1 font-light text-gray">
              {t('speed-test.ms')}
            </UiText>
          </View>
        </View>

        <View
          className="flex-row justify-between rounded-3xl bg-white px-6 py-1 opacity-70"
          style={shadows.md}
        >
          <View className="w-36 items-center justify-center py-3">
            <UiText className="text-base font-medium text-gray">
              {t('speed-test.download')}
            </UiText>
            <View className="flex-row items-end gap-1 pt-2">
              <View className="pb-1">
                <DownloadIcon />
              </View>
              <UiText className="text-1.5xl font-light text-[#3870FF]">
                {speedtestStatus === 'testing' && progress?.type === 'download'
                  ? progress.result.toFixed(1)
                  : (result.download?.toFixed(1) ?? '--.--')}
              </UiText>
              <UiText className="pb-0.5 pl-5 text-sm font-light text-gray">
                {t('speed-test.mbs')}
              </UiText>
            </View>
          </View>

          <View className="w-[1] bg-gray opacity-30" />

          <View className="w-36 items-center justify-center py-3">
            <UiText className="text-base font-medium text-gray">
              {t('speed-test.upload')}
            </UiText>
            <View className="flex-row items-end gap-1 pt-2">
              <View className="pb-1">
                <UploadIcon />
              </View>
              <UiText className="text-1.5xl font-light text-[#78E83F]">
                {speedtestStatus === 'testing' && progress?.type === 'upload'
                  ? progress.result.toFixed(1)
                  : (result.upload?.toFixed(1) ?? '--.--')}
              </UiText>
              <UiText className="pb-0.5 pl-5 text-sm font-light text-gray">
                {t('speed-test.mbs')}
              </UiText>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1" />

      <View className="rounded-t-3xl border border-[#00000010] bg-white px-4 pb-14 pt-6">
        <ButtonPrimary
          disabled={speedtestStatus === 'testing'}
          label={buttonText}
          onPress={handleStart}
          className=" h-14"
          style={shadows.md}
        />
      </View>

      {showModal && (
        <View className="absolute inset-0 z-[999] items-center justify-center bg-[rgba(0,0,0,0.70)] px-6">
          <View className="relative w-full items-center rounded-3xl bg-white px-5 py-13">
            <UiText
              onPress={() => setShowModal(false)}
              className="absolute right-4 top-4 text-2xl font-semibold text-gray"
            >
              ×
            </UiText>
            <UiText className="text-center text-2xl font-semibold">
              {t('speed-test.modal.title')}
            </UiText>
            <UiText className="mt-3 text-center text-base text-gray opacity-70">
              {t('speed-test.modal.description')}
            </UiText>
            <ButtonPrimary
              label={t('speed-test.modal.retry')}
              onPress={retryTest}
              className="mt-6 h-12 w-full"
            />
            <Pressable
              onPress={() => setShowModal(false)}
              className="mt-3 h-12 w-full items-center justify-center rounded-xl bg-[#EFEFEF]"
            >
              <UiText className="text-lg font-medium text-gray">
                {t('speed-test.modal.back')}
              </UiText>
            </Pressable>
          </View>
        </View>
      )}
    </Layout>
  );
}
