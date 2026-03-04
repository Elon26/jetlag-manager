import type { ModalStackParams } from '@/components/modals';
import { colors } from '@/config/theme';
import CloseIcon from '@/svg/secret-folder/close.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';
import { UiTextInput } from '@/ui/ui-text-input';
import { type Dispatch, type SetStateAction, useState } from 'react';
import {
  Pressable,
  Switch,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { type ModalComponentProp, useModal } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  addPassword,
  updatePassword,
  useSecretPassword,
} from '../hooks/use-secret-passwords';
import {
  charSets,
  generatePassword,
} from '../hooks/use-secret-passwords/helper';
import { PasswordLengthSlider } from './password-length-slider';

type Charset = keyof typeof charSets;
const DEFAULT_CHARSET: Charset[] = ['digits', 'letters'];
const DEFAULT_PASSWORD_LENGTH = 8;

export function SecretPasswordModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'SecretPasswordModal'>) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const id = params?.id;
  const pw = useSecretPassword(id ?? '');

  let initialCharset: Charset[] = DEFAULT_CHARSET;
  let initialPasswordLength = DEFAULT_PASSWORD_LENGTH;
  if (pw?.password?.length) {
    const p = pw.password;
    initialCharset = [];
    initialPasswordLength = p.length;
    for (const [name, chars] of Object.entries(charSets)) {
      if (new RegExp(`[${chars}]`, 'g').test(p)) {
        initialCharset.push(name as Charset);
      }
    }
  }

  const [charset, setCharset] = useState(initialCharset);
  const [passwordLength, setPasswordLength] = useState(initialPasswordLength);

  const useLink = useState(pw?.link ?? '');
  const useUsername = useState(pw?.login ?? '');
  const usePassword = useState(
    pw?.password ?? generatePassword(initialPasswordLength, charset)
  );

  const [link, login, password] = [useLink[0], useUsername[0], usePassword[0]];

  const getStateHash = () => JSON.stringify({ link, login, password });

  const [initialHash] = useState(() => getStateHash());

  const isChanged = initialHash !== getStateHash();

  const submitDisabled = !link || !login || !password || !isChanged;
  const modal = useModal<ModalStackParams>();

  const handleSubmit = () => {
    if (id) {
      updatePassword({
        id,
        link,
        login,
        password,
      });
    } else {
      addPassword({
        link,
        login,
        password,
      });
    }
  };

  return (
    <View
      className="bg-white px-edge"
      style={{
        width,
        height,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Pressable
        className="absolute right-5 top-19 z-10"
        onPress={() => {
          modal.closeModal('SecretPasswordModal');
        }}
      >
        <CloseIcon />
      </Pressable>

      <UiText className="my-5 text-center text-lg font-semibold">
        {id === undefined ? 'New Secret Password' : useLink[0]}
      </UiText>
      <Form
        charsets={charset}
        passwordLength={passwordLength}
        setPasswordLength={setPasswordLength}
        useLink={useLink}
        usePassword={usePassword}
        useUsername={useUsername}
      />
      <Buttons
        currentCharsets={charset}
        handleSubmit={handleSubmit}
        passwordLength={passwordLength}
        setCharset={setCharset}
        setPassword={usePassword[1]}
        submitDisabled={submitDisabled}
      />
    </View>
  );
}

type FormProps = {
  useLink: [string, Dispatch<SetStateAction<string>>];
  useUsername: [string, Dispatch<SetStateAction<string>>];
  usePassword: [string, Dispatch<SetStateAction<string>>];
  passwordLength: number;
  setPasswordLength: Dispatch<SetStateAction<number>>;
  charsets: Charset[];
};

function Form({
  useLink,
  usePassword,
  useUsername,
  passwordLength,
  setPasswordLength,
  charsets,
}: FormProps) {
  const [link, setLink] = useLink;
  const [username, setUsername] = useUsername;
  const [password, setPassword] = usePassword;

  return (
    <View className="my-1.5 gap-6">
      <View>
        <UiTextInput
          keyboardType="url"
          label="Link"
          onChangeText={setLink}
          placeholder="Link here"
          value={link}
        />

        <UiTextInput
          keyboardType="default"
          label="Username"
          onChangeText={setUsername}
          placeholder="Username here"
          value={username}
        />

        <View className="h-4" />
        <UiTextInput
          keyboardType="visible-password"
          label="Password"
          onChangeText={setPassword}
          placeholder="Password here"
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          value={password}
        >
          <TouchableOpacity
            className="absolute bottom-4.5 right-3"
            onPress={() =>
              setPassword(generatePassword(passwordLength, charsets))
            }
          >
            <UiText className="font-semibold text-primary">Generate</UiText>
          </TouchableOpacity>
        </UiTextInput>
      </View>
      <PasswordLengthSlider
        onChange={(val) => {
          setPasswordLength(val);
          if (typeof val === 'number') {
            setPassword(generatePassword(val, charsets));
          }
        }}
        value={passwordLength}
      />
    </View>
  );
}

const options: [string, string, Charset][] = [
  ['Digits', 'e.g. 123', 'digits'],
  ['Letters', 'e.g. abc', 'letters'],
  ['Symbols', 'e.g.%!#', 'symbols'],
];

type ButtonsProps = {
  currentCharsets: Charset[];
  setCharset: Dispatch<SetStateAction<Charset[]>>;
  setPassword: Dispatch<SetStateAction<string>>;
  passwordLength: number;
  submitDisabled: boolean;
  handleSubmit: () => void;
};

function Buttons({
  currentCharsets,
  setCharset,
  setPassword,
  passwordLength,
  submitDisabled,
  handleSubmit,
}: ButtonsProps) {
  const modal = useModal<ModalStackParams>();

  const isCharsetEnabled = (name: Charset) => currentCharsets.includes(name);

  const toggleCharset = (name: Charset) => {
    setCharset((charsets) => {
      const newCS = charsets.includes(name)
        ? charsets.filter((charset) => charset !== name)
        : [...charsets, name];

      if (newCS.length === 0) {
        setPassword(generatePassword(passwordLength, ['digits']));
        return ['digits'];
      }
      setPassword(generatePassword(passwordLength, newCS));
      return newCS;
    });
  };

  return (
    <View className="flex-1 gap-6 pb-2.5">
      {options.map(([title, subtitle, charset]) => (
        <View className="flex-row items-center gap-2" key={title}>
          <UiText>{title}</UiText>
          <UiText className="text-lg text-gray">({subtitle})</UiText>
          <View className="flex-1" />
          <Switch
            onValueChange={() => toggleCharset(charset)}
            thumbColor={colors.white.toString()}
            trackColor={{
              false: colors.gray.toString(),
              true: colors.primary.toString(),
            }}
            value={isCharsetEnabled(charset)}
          />
        </View>
      ))}
      <View className="flex-1" />
      <View className="gap-2 px-2">
        <ButtonPrimary
          className=""
          disabled={submitDisabled}
          label="Save"
          onPress={() => {
            if (!submitDisabled) {
              handleSubmit();
              modal.closeModal('SecretPasswordModal');
            }
          }}
        />
      </View>
    </View>
  );
}
