import 'react-native-get-random-values';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdentity as baseGetUserIdentity } from 'expo-user-identity';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = '_USER_ID';

async function createNewUserId() {
  const newId = uuidv4().toString();
  await AsyncStorage.setItem(STORAGE_KEY, newId);

  return newId;
}

export default async function getUserIdentity() {
  const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (storedValue) {
    return storedValue;
  }

  try {
    const result = await baseGetUserIdentity();

    if (result !== null) {
      await AsyncStorage.setItem(STORAGE_KEY, result);
      return result;
    }
  } catch (error) {
    console.error(error);
  }

  return createNewUserId();
}
