import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      session: null,
      userName: '',
      setUser: (userName, session) =>
        set((state) => ({
          userName,
          isAuthenticated: true,
          session,
        })),
      logout: () =>
        set(() => ({
          userName: null,
          isAuthenticated: false,
          session: null,
        })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
