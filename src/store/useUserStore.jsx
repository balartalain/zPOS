import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserStore = create(
  persist(
    (set, get) => ({
      sessionExpired: true,
      user: null,
      setUser: ({ id, name, role, email, active = true }) => {
        console.log('setUser');
        set((state) => ({
          user: {
            ...state.user,
            id,
            name,
            role,
            email,
            active,
          },
          sessionExpired: false,
        }));
      },
      setSessionExpired: (sessionExpired) =>
        set(() => ({
          sessionExpired,
        })),
      setSession: (session) =>
        set((state) => ({
          session,
        })),
      logout: () =>
        set(() => ({
          user: null,
          sessionExpired: true,
        })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
