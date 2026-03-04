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
import { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { ModalStackParams } from '@/components/modals';
import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

export function EditNoteModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'EditNoteModal'>) {
  const id = params?.id;
  const { closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [savedNotes, setSavedNotes] = useStorage('savedNotes');
  const currentNote = savedNotes.find((note) => note.id === id);

  const [windowHeight, setWindowHeight] = useState(height);
  const [name, setName] = useState(currentNote?.name || '');
  const [description, setDescription] = useState(
    currentNote?.description || ''
  );
  const [hasNameError, setHasNameError] = useState(false);
  const nameInputRef = useRef<null | TextInput>(null);
  const descriptionInputRef = useRef<null | TextInput>(null);

  function handleDelete() {
    const updatedNotes = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(updatedNotes);
    closeModal('EditNoteModal');
  }

  function handleCreate() {
    if (!name) {
      setHasNameError(true);
      return;
    }

    setSavedNotes((prev) => {
      const newArr = prev.map((note) => {
        return note.id === id
          ? {
              id: note.id,
              type: note.type,
              name,
              description,
              taskTime: null,
              taskPoints: null,
              taskEndTime: null,
              members: null,
              notificationId: null,
              creationTime: note.creationTime,
              updateTime: Date.now(),
            }
          : note;
      });
      return newArr;
    });
    closeModal('EditNoteModal');
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
          onPress={() => closeModal('EditNoteModal')}
        >
          <CloseIcon />
        </Pressable>
        <View className="gap-y-8">
          <UiText className="text-center text-2xl font-semibold">
            {t('timezone.edit-note')}
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
          <View className="items-center gap-y-2">
            <UiButton
              className="w-full rounded-xl bg-red"
              onPress={handleDelete}
            >
              <UiText className="text-xl font-semibold capitalize text-white">
                {t('basic.delete')}
              </UiText>
            </UiButton>
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
