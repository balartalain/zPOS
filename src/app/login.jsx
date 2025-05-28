import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { supabase } from '@/src/service/supabase-config';
import useUserStore from '@/src/store/useUserStore';
import useModalStore from '@/src/store/useModalStore';
import { useData } from '@/src/context/dataContext';
import { useAuth } from '@/src/context/userContext';

const LoginScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { setUser, setSession } = useUserStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showModal, hideModal } = useModalStore();
  const { signIn, signOut } = useAuth();
  const { refreshMasterData } = useData();
  const handleLogin = async () => {
    try {
      //showModal({ label: 'Iniciando sessión' });
      await signIn(username, password);
      await refreshMasterData();
      router.replace('(pos)');
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
      //hideModal();
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
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Iniciar Sesión
        </Button>
      </View>
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
    paddingVertical: 8,
  },
});

export default LoginScreen;
