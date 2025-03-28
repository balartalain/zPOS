import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";

const NumericKeyboardGrid = () => {
  const [inputValue, setInputValue] = useState(''); // Estado del campo de entrada

  // Función para manejar la eliminación de dígitos
  const handleDelete = () => {
    setInputValue((prev) => prev.slice(0, -1)); // Elimina el último carácter
  };

  // Función para manejar el envío
  const handleSend = () => {
    Alert.alert('Número enviado', `El número ingresado es: ${inputValue}`);
    setInputValue(''); // Limpia el campo después de enviar
  };

  // Función para agregar números
  const handlePress = (number) => {
    setInputValue((prev) => prev + number); // Concatena el número ingresado
  };

  return (
    <View style={styles.container}>
      {/* Grid con los números y botones adicionales */}
      <View style={styles.grid}>
        {/* Números del 1 al 9 */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            mode="outlined"
            onPress={() => handlePress(number.toString())}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.contentStyle}
          >
            {number}
          </Button>
        ))}

        {/* Botón para eliminar (primer espacio de la última fila) */}
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.contentStyle}
        >
           
        </Button>

        {/* Número 0 (en la última fila) */}
        <Button
          mode="outlined"
          onPress={() => handlePress('0')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.contentStyle}
        >
          0
        </Button>

        {/* Botón para enviar (último espacio de la última fila) */}
        <Button
          mode="contained"
          onPress={handleSend}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.contentStyle}
        >
          Aceptar
        </Button>
      </View>
    </View>
  );
};

export default NumericKeyboardGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  grid: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    width: '30%', // Cada botón ocupa el 30% del ancho para ajustarse al grid
    margin: 5,
    padding:0,
  },
  buttonLabel: {
    fontSize: 20,
  },
  contentStyle: {
    paddingVertical: 18
  }
});
