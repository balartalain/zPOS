import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { AppState } from 'react-native';
import { supabase } from '@/src/service/supabase-config';
import { useRouter } from 'expo-router';
import useUserStore from '@/src/store/useUserStore';
import useNetWorkStatus from '../hooks/useNetworkStatus';

const UserContext = createContext(null);
export function UserProvider({ children }) {
  const router = useRouter();
  const isConnected = useNetWorkStatus();
  //const [isUserActive, setIsUserActive] = useState(false);
  const { user, setUser, logout, sessionExpired, setSessionExpired } =
    useUserStore();

  useEffect(() => {
    (async () => {
      if (user && isConnected) {
        const active = await isProfileActive(user.id);
        //console.log(active);
        if (!active) {
          signOut();
        }
      }
    })();
    AppState.addEventListener('change', async (state) => {
      console.log('AppState->UserContext->changed:', state);
      if (state === 'active') {
        if (user && isConnected) {
          const active = await isProfileActive(user.id);
          if (!active) {
            signOut();
          }
        }
      }
    });
  }, [user, isConnected, isProfileActive, signOut]);
  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error('Credenciales no válidas');
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, role, active')
        .eq('id', data.session.user.id)
        .single();
      if (profileError) {
        console.log('Error fetching profile:', profileError);
      }
      if (!profile || !profile.active) {
        throw new Error('El usuario no está activo.');
      }
      setUser({
        id: data.session.user.id,
        name: profile.name,
        role: profile.role,
        email: email,
        active: true,
      });
    },
    [setUser]
  );
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        //console.error('Error signing out:', error);
        // throw error;
      }
    } catch {
      //ignore
    } finally {
      logout();
      router.replace('login');
    }
  }, [logout, router]);

  const isProfileActive = useCallback(
    async (userId) => {
      const id = userId || user?.id;
      if (!id) {
        return null;
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, active')
        .eq('id', id)
        .single();
      if (error) {
        console.log('Error fetching profile:', error);
        return null;
      }
      console.log('Profile:', profile);
      return profile && profile.active;
    },
    [user?.id]
  );

  useEffect(() => {
    if (!user || sessionExpired) {
      router.replace('login');
    }
    //} else {
    // const { expires_at } = session;
    // if (expires_at * 1000 < Date.now()) {
    //   router.replace('login/session_expired');
    // }
    //}
  }, [user, router, sessionExpired]);

  // useEffect(() => {
  //   //console.log('UserProvider mounted');
  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     async (_event, session) => {
  //       //if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
  //       //console.log(_event, session);
  //       setSession(session);
  //     }
  //   );
  //   return () => {
  //     authListener?.subscription.unsubscribe();
  //   };
  // }, [setSession]);
  const value = React.useMemo(
    () => ({
      signIn,
      signOut,
      isProfileActive,
      setSessionExpired,
      sessionExpired,
      isConnected,
    }),
    [
      signIn,
      signOut,
      isProfileActive,
      setSessionExpired,
      sessionExpired,
      isConnected,
    ]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export const useAuth = () => useContext(UserContext);
