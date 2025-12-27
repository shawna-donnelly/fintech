import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

const storage = createMMKV({ id: 'balanceStorage' });

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: name => {
    storage.remove(name);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
};
