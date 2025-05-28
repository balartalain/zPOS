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
  const { user, setUser, setSession, logout } = useUserStore();

  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        //console.log(JSON.stringify(error, null, 2));
        throw error;
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', data.session.user.id)
        .single();
      if (profileError) {
        //console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      setUser({
        name: profile.name,
        role: profile.role,
        email: email,
      });
      // setSession(data.session);
    },
    [setUser]
  );
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    logout();
  }, [logout]);

  useEffect(() => {
    console.log('UserProvider useEffect=>', user);
    if (!user) {
      router.replace('login');
    }
    //} else {
    // const { expires_at } = session;
    // if (expires_at * 1000 < Date.now()) {
    //   router.replace('login/session_expired');
    // }
    //}
  }, [user, router]);

  useEffect(() => {
    console.log('UserProvider mounted');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        //if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log(_event, session);
        setSession(session);
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setSession]);
  const value = React.useMemo(
    () => ({
      signIn,
      signOut,
    }),
    [signIn, signOut]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export const useAuth = () => useContext(UserContext);
