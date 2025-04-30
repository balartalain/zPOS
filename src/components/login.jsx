import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import useUserStore from '../store/useUserStore';
import useModalStore from '../store/useModalStore';

import ProductModel from '../model/productModel';
import CategoryModel from '../model/categoryModel';

const { height } = Dimensions.get('window');

const Login = () => {
  const { colors } = useTheme();
  const { setUser } = useUserStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showModal, hideModal } = useModalStore();

  const handleLogin = async () => {
    // Aquí iría la lógica de autenticación
    console.log('Login pressed with:', username, password);
    await loadMasterdata();
    setUser(username);
  };
  const loadMasterdata = async () => {
    showModal({ label: 'Desacargando masterdata' });
    await CategoryModel.fetchAll();
    await ProductModel.fetchAll();
    hideModal();
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

export default Login;
