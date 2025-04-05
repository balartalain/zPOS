import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userName: '',
      setUser: (userName) =>
        set((state) => ({
          userName,
          isAuthenticated: true,
        })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
