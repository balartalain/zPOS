import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserStore = create(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      setUser: ({ name, role, email }) => {
        console.log('setUser');
        set((state) => ({
          user: {
            ...state.user,
            name,
            role,
            email,
          },
        }));
      },
      setSession: (session) =>
        set((state) => ({
          session,
        })),
      logout: () =>
        set(() => ({
          user: null,
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
