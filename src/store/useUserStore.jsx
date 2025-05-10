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
      logout: () =>
        set(() => ({
          userName: null,
          isAuthenticated: false,
        })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
