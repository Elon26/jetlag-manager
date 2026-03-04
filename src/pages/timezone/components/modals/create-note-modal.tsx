import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Pressable,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import { Note } from '../../types/note';
import NoteType from '../../types/note-type';

export function CreateNoteModal() {
  const { closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();
  const setSavedNotes = useSetStorage('savedNotes');

  const [windowHeight, setWindowHeight] = useState(height);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hasNameError, setHasNameError] = useState(false);
  const nameInputRef = useRef<null | TextInput>(null);
  const descriptionInputRef = useRef<null | TextInput>(null);

  function handleCreate() {
    if (!name) {
      setHasNameError(true);
      return;
    }

    const newNote: Note = {
      id: uuid(),
      type: NoteType.note,
      name,
      description,
      taskTime: null,
      taskPoints: null,
      taskEndTime: null,
      notificationId: null,
      members: null,
      creationTime: Date.now(),
      updateTime: Date.now(),
    };
    setSavedNotes((prev) => [...prev, newNote]);
    closeModal('CreateNoteModal');
  }

  useEffect(() => {
    setHasNameError(false);
  }, [name]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setWindowHeight(height - e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setWindowHeight(height);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <BlurView
      className="items-center justify-center"
      style={{
        width,
        height: windowHeight,
      }}
      tint="dark"
      intensity={30}
    >
      <Pressable
        className="gap-y-8 rounded-xl bg-white px-5 pb-9 pt-12.5 "
        style={{
          width: width - scaleX(32),
        }}
        onPress={() => {
          nameInputRef.current?.blur();
          descriptionInputRef.current?.blur();
        }}
      >
        <Pressable
          className="absolute right-2 top-2 size-10 items-center justify-center"
          onPress={() => closeModal('CreateNoteModal')}
        >
          <CloseIcon />
        </Pressable>
        <View className="gap-y-8">
          <UiText className="text-center text-2xl font-semibold">
            {t('timezone.add-note')}
          </UiText>
          <View className="gap-y-4">
            <Pressable
              className={twMerge(
                'gap-y-1 rounded-xl border-2 border-white bg-white p-2',
                hasNameError ? 'border-red' : 'border-white'
              )}
              style={shadows.md}
              onPress={() => nameInputRef.current?.focus()}
            >
              <UiText className="text-xs font-medium text-gray">
                {t('timezone.note-name')}
              </UiText>
              <TextInput
                ref={nameInputRef}
                value={name}
                onChangeText={setName}
              />
            </Pressable>
            <Pressable
              className="gap-y-1 rounded-xl border-2 border-white bg-white p-2"
              style={shadows.md}
              onPress={() => descriptionInputRef.current?.focus()}
            >
              <UiText className="text-xs font-medium text-gray">
                {t('timezone.description')}
              </UiText>
              <TextInput
                ref={descriptionInputRef}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                style={{ height: scaleY(74) }}
              />
            </Pressable>
          </View>
          <View className="items-center">
            <UiButton className="w-full rounded-xl" onPress={handleCreate}>
              <UiText className="text-xl font-semibold capitalize text-white">
                {t('basic.save')}
              </UiText>
            </UiButton>
          </View>
        </View>
      </Pressable>
    </BlurView>
  );
}
