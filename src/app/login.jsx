import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import useUserStore from '@/src/store/useUserStore';
import { useData } from '@/src/context/dataContext';
import { useAuth } from '@/src/context/userContext';

import LoadingModal from '@/src/components/loadingModal';
import { checkInternetConnectivity } from '@/src/hooks/useNetworkStatus';
import SharedButton from '../components/shared/sharedButton';
const LoginScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const { refreshMasterData } = useData();
  const [showModal, setShowModal] = useState(false);
  const { user } = useUserStore();

  const handleLogin = async () => {
    try {
      setShowModal(true);
      const isConnected = await checkInternetConnectivity();
      if (isConnected) {
        await signIn(username, password);
        await refreshMasterData();
        router.replace('(pos)');
      } else {
        throw new Error('No tiene conexión');
      }
    } catch (error) {
      //if (error.code === 'invalid_credentials') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        position: 'bottom',
      });
      //}
    } finally {
      setShowModal(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* Primer View (60% de la pantalla) */}
      <View
        style={[
          styles.imageContainer,
          { flex: 1.8, backgroundColor: colors.primary },
        ]}
      >
        <Image
          source={require('../../assets/images/logo.png')} // Reemplaza con la ruta correcta de tu imagen
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Segundo View (Controles de Login) */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Usuario"
          value={username}
          onChangeText={(text) => setUsername(text)}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" color={colors.primary} />}
        />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" color={colors.primary} />}
        />
        <SharedButton label="Iniciar Sesión" onPress={handleLogin} />
        {user && (
          <Button mode="outlained" onPress={() => router.replace('(pos)')}>
            Continuar sin conexión
          </Button>
        )}
      </View>
      <LoadingModal visible={showModal} text="Iniciando sessión..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Un fondo claro para contraste
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120, // Ajusta el tamaño de la imagen según necesites
    height: 120,
  },
  inputContainer: {
    flex: 1, // El resto del espacio disponible
    padding: 20,
    justifyContent: 'center', // Alinea los elementos desde la parte superior
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 5,
  },
});

export default LoginScreen;
