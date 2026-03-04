import { useAnalytics } from '@kirz/expo-toolkit';
import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { InteractionManager, useWindowDimensions, View } from 'react-native';

import { Layout } from '@/components/layout';
import { useConfig } from '@/hooks/use-config';
import { useStorage } from '@/hooks/use-storage';
import { Grid } from '@/ui/grid';

import TimezoneCard from '../timezone/components/timezone-card';
import createFirstTimezone from '../timezone/utils/create-first-timezone';
import { CleanerWidget } from './components/cleaner';
import { GallerySummaryWidget } from './components/cleaner-block';
import { CleanerNotifications } from './components/cleaner-notification';
import { ContactsOrganiserWidget } from './components/contacts-organiser';
import { ContactsOrganiserWidgetLock } from './components/contacts-organiser-lock';
import { GalleryOrganiserWidget } from './components/gallery-organiser';
import { GalleryOrganiserWidgetLock } from './components/gallery-organiser-lock';
import ResumeArea from './components/resume-area';
import { SecretFolderWidget } from './components/secret-folder';
import { SpeedTestWidget } from './components/speed-test';
import { StorageUsageWidget } from './components/storage-usage';

export function Homescreen() {
  const { width } = useWindowDimensions();
  const [savedTimezones, setSavedTimezones] = useStorage('savedTimezones');
  const [isFirstTimezonesLaunch, setIsFirstTimezonesLaunch] = useStorage(
    'isFirstTimezonesLaunch'
  );
  const { indexLayout } = useConfig();

  const { logEvent } = useAnalytics();

  const [contactsPerm, setContactsPerm] = useState<
    'unknown' | 'granted' | 'denied'
  >('unknown');
  const [galleryPerm, setGalleryPerm] = useState<
    'unknown' | 'granted' | 'denied'
  >('unknown');

  useEffect(() => {
    Contacts.getPermissionsAsync().then((p) => {
      setContactsPerm(p.status === 'granted' ? 'granted' : 'denied');
    });

    MediaLibrary.getPermissionsAsync().then((p) => {
      setGalleryPerm(p.status === 'granted' ? 'granted' : 'denied');
    });
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      logEvent('home_screen');
    }); // NB: Calling logEvent on a main thread causing a delayed render
  }, [logEvent]);

  useEffect(() => {
    if (isFirstTimezonesLaunch) {
      createFirstTimezone().then((res) => {
        const firstTimezone = res;
        if (firstTimezone) {
          setSavedTimezones([...savedTimezones, firstTimezone]);
          setIsFirstTimezonesLaunch(false);
        }
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      Contacts.getPermissionsAsync().then((p) => {
        setContactsPerm(p.status === 'granted' ? 'granted' : 'denied');
      });
      MediaLibrary.getPermissionsAsync().then((p) => {
        setGalleryPerm(p.status === 'granted' ? 'granted' : 'denied');
      });
    }, [])
  );

  return (
    <Layout className="-mt-10 mb-5 flex-1 overflow-visible px-4" scroll header>
      <View>
        {indexLayout === 'a' ? (
          <>
            <View className="my-2">
              {savedTimezones.length > 0 && (
                <TimezoneCard
                  timezoneObj={savedTimezones[0]}
                  currentTimeShift={width}
                  isInMainPage
                />
              )}
            </View>
            <ResumeArea />
            <CleanerWidget />
          </>
        ) : (
          <View className="gap-2">
            <CleanerNotifications />
            <GallerySummaryWidget />
            <StorageUsageWidget />
          </View>
        )}

        <Grid columns={2} className="pt-2.5">
          {galleryPerm === 'granted' ? (
            <GalleryOrganiserWidget />
          ) : (
            <GalleryOrganiserWidgetLock />
          )}
          <SecretFolderWidget />
          {contactsPerm === 'granted' ? (
            <ContactsOrganiserWidget />
          ) : (
            <ContactsOrganiserWidgetLock />
          )}
          <SpeedTestWidget />
        </Grid>
        {indexLayout === 'a' ? null : (
          <View className="gap-2 pt-2.5">
            {savedTimezones.length > 0 && (
              <TimezoneCard
                timezoneObj={savedTimezones[0]}
                currentTimeShift={width}
                isInMainPage
              />
            )}
            <ResumeArea />
          </View>
        )}
      </View>
    </Layout>
  );
}
