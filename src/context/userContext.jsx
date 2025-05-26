import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { supabase } from '@/src/service/supabase-config';
import { useRouter } from 'expo-router';
import useUserStore from '@/src/store/useUserStore';

const UserContext = createContext(null);
export function UserProvider({ children }) {
  const router = useRouter();
  const { session, setUser } = useUserStore();
  async function getSession() {
    try {
      const { error, data } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      if (data.session) {
        setUser('alain', session);
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (!session) {
      router.replace('/login');
    } else {
      const { expires_at } = session;
      if (expires_at * 1000 < Date.now()) {
        router.replace('/login/session_expired');
      }
    }
  }, [router, session]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        //if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        //setUser()
        // await AsyncStorage.setItem('session', JSON.stringify(session));
        console.log(session);
        //}
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  return <UserContext.Provider>{children}</UserContext.Provider>;
}
export const useAuth = () => useContext(UserContext);
