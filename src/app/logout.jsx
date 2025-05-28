import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/src/context/userContext';

const LogoutScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  useEffect(() => {
    try {
      signOut();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error de conexión. ',
        position: 'bottom',
      });
      router.replace('(pos)');
    }
  }, [router, signOut]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Cerrando sesión...</Text>
    </View>
  );
};

export default LogoutScreen;
