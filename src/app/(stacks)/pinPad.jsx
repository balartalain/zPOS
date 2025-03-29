import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApproval } from '@/src/components/approvalContext';

const CORRECT_PIN = '1234'; // Reemplaza con tu lógica de verificación real

export default function PinPadScreen() {
  const router = useRouter();
  const { setGrantedApproval } = useApproval();
  const { from } = useLocalSearchParams(); // Obtiene la ruta de origen

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinInput = (text) => {
    setPin(text);
    setError(''); // Limpiar el error al escribir
  };

  const handleSubmitPin = () => {
    if (pin === CORRECT_PIN) {
      setGrantedApproval(true); // Marca al usuario como autenticado
      if (from) {
        router.replace(from); // Navega a la pantalla protegida original
      } else {
        router.replace('index'); // Si no hay origen, ve al inicio
      }
    } else {
      setError('PIN incorrecto');
      setPin(''); // Limpiar el PIN después de un intento fallido
    }
  };

  const handleGoBack = () => {
    router.back(); // Vuelve a la pantalla anterior
  };

  useEffect(() => {
    // Limpiar el estado de autenticación al desmontar la pantalla del pin-pad
    return () => {
      // Opcional: Si quieres que la autenticación persista, no hagas esto.
      // setAuthenticated(false);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingrese el PIN de Aprobación</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={4}
        value={pin}
        onChangeText={handlePinInput}
        secureTextEntry={false}
        autoFocus
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Verificar PIN" onPress={handleSubmitPin} />
      <Button title="Volver" onPress={handleGoBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: 150,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
