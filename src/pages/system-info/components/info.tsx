import { shadows } from '@/config/theme';
import { useSpeedTest } from '@/hooks/use-speedtest';
import { UiText } from '@/ui/ui-text';
import { usePromise } from '@/utils/use-promise';
import {
  getBuildId,
  getDeviceId,
  getDeviceName,
  getNetworkInfo,
  getSystemUptime,
  getSystemVersion,
} from '@kirz/react-native-device-info';
import * as Device from 'expo-device';
import { getNetworkStateAsync, type NetworkStateType } from 'expo-network';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const displayValue = (val?: string | number | null) =>
  val === undefined || val === null || val === '' ? 'Unknown' : String(val);

function getNWStateTypeReadable(type: NetworkStateType | undefined) {
  switch (type) {
    case 'NONE':
      return '-';
    case 'UNKNOWN':
      return 'Unknown';
    case 'CELLULAR':
      return 'Cellular';
    case 'WIFI':
      return 'Wi-Fi';
    case 'BLUETOOTH':
      return 'Bluetooth';
    case 'ETHERNET':
      return 'Ethernet';
    case 'WIMAX':
      return 'Wimax';
    case 'VPN':
      return 'Vpn';
    case 'OTHER':
      return 'Other';
    default:
      return '';
  }
}

export function InfoBlock() {
  const { t } = useTranslation();
  const [info, setInfo] = useState<{
    deviceName: string;
    systemVersion: string;
    deviceId: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [deviceName, systemVersion, deviceId] = await Promise.all([
        getDeviceName(),
        getSystemVersion(),
        Device.modelName ?? getDeviceId(),
      ]);

      setInfo({
        deviceName,
        systemVersion,
        deviceId,
      });
    })();
  }, []);

  const systemVersion = getSystemVersion();
  const buildNumber = usePromise(getBuildId());
  const nwInfo = usePromise(getNetworkInfo());
  const nwState = usePromise(getNetworkStateAsync());
  const { statusAtom, resultsAtom, progressAtom } = useSpeedTest();
  const progress = useAtomValue(progressAtom);
  const speedtestStatus = useAtomValue(statusAtom);
  const result = useAtomValue(resultsAtom);
  const activeTime = usePromise(getSystemUptime());
  const activeTimeSplit = activeTime?.split(' ');
  const activeTimeFormatted =
    activeTimeSplit &&
    `${activeTimeSplit[0]}d ${activeTimeSplit[1]}h ${activeTimeSplit[2]}m`;

  return (
    <>
      <View
        className=" justify-between gap-3 rounded-xl bg-white p-5"
        style={shadows.md}
      >
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.device.name')}
          </UiText>
          <UiText className="font-medium text-gray">
            {info?.deviceName ?? ''}
          </UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.device.ios-version')}
          </UiText>
          <UiText className="font-medium text-gray">{systemVersion}</UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.device.device-id')}
          </UiText>
          <UiText className="font-medium text-gray">
            {info?.deviceId ?? ''}
          </UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.device.build-number')}
          </UiText>
          <UiText className="font-medium text-gray">{buildNumber}</UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.device.active-time')}
          </UiText>
          <UiText className="font-medium text-gray">
            {activeTime ? activeTimeFormatted : '-'}
          </UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
      </View>
      <View
        className=" justify-between gap-3 rounded-xl bg-white p-5"
        style={shadows.md}
      >
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.network.connection')}
          </UiText>
          <UiText className="font-medium text-gray">
            {getNWStateTypeReadable(nwState?.type)}
          </UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.network.ip-address')}
          </UiText>
          <UiText className="font-medium text-gray">
            {displayValue(nwInfo?.wiFiIPAddress)}
          </UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.network.upload-speed')}
          </UiText>
          <UiText className="font-medium text-[#FF723D]">
            {' '}
            {speedtestStatus === 'testing' && progress?.type === 'upload'
              ? `${progress.result.toFixed(1)}`
              : result.upload
                ? `${result.upload.toFixed(1)}`
                : '-'}{' '}
            {t('system-info.network.megabits-per-second')}
          </UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
        <View className="flex-row justify-between">
          <UiText className="font-medium">
            {t('system-info.network.download-speed')}
          </UiText>
          <UiText className="font-medium text-[#3870FF]">
            {speedtestStatus === 'testing' && progress?.type === 'download'
              ? `${progress.result.toFixed(1)}`
              : result.download
                ? `${result.download.toFixed(1)}`
                : '-'}{' '}
            {t('system-info.network.megabits-per-second')}
          </UiText>
        </View>
        <View className="h-px w-full bg-black/10" />
      </View>
    </>
  );
}
