import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Dropdown,
} from 'react-native-paper';
import { useRouter } from 'expo-router';

const AddProductScreen = () => {
  const router = useRouter();

  // Estado para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [cantidad, setCantidad] = useState('');

  // Estado para controlar la visibilidad del dropdown de categorías
  const [showDropdown, setShowDropdown] = useState(false);

  // Estado para las categorías disponibles (simulado)
  const [categorias, setCategorias] = useState([
    { label: 'Electrónicos', value: 'electronicos' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Libros', value: 'libros' },
    { label: 'Alimentos', value: 'alimentos' },
    // ... más categorías
  ]);

  // Estado para mostrar mensajes de error
  const [errores, setErrores] = useState({});

  // Función para validar el formulario
  const validarFormulario = () => {
    let nuevosErrores = {};
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    if (!categoria) {
      nuevosErrores.categoria = 'La categoría es requerida';
    }
    if (
      !precio.trim() ||
      isNaN(parseFloat(precio)) ||
      parseFloat(precio) <= 0
    ) {
      nuevosErrores.precio = 'El precio debe ser un número mayor que cero';
    }
    if (!costo.trim() || isNaN(parseFloat(costo)) || parseFloat(costo) < 0) {
      nuevosErrores.costo = 'El costo debe ser un número mayor o igual a cero';
    }
    if (
      !cantidad.trim() ||
      !Number.isInteger(parseInt(cantidad)) ||
      parseInt(cantidad) < 0
    ) {
      nuevosErrores.cantidad =
        'La cantidad debe ser un entero mayor o igual a cero';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (validarFormulario()) {
      // Aquí podrías enviar los datos del nuevo artículo a tu backend o gestionarlos localmente
      const nuevoArticulo = {
        nombre,
        categoria,
        precio: parseFloat(precio),
        costo: parseFloat(costo),
        cantidad: parseInt(cantidad),
      };
      console.log('Nuevo artículo a agregar:', nuevoArticulo);
      // Después de agregar el artículo, podrías navegar a otra pantalla
      router.push('/'); // Por ejemplo, volver a la pantalla de inicio
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Agregar Artículo
      </Text>

      <TextInput
        label="Nombre"
        value={nombre}
        onChangeText={setNombre}
        mode="outlined"
        style={styles.input}
        error={!!errores.nombre}
      />
      {errores.nombre && <HelperText type="error">{errores.nombre}</HelperText>}

      <Dropdown
        label="Categoría"
        value={categoria}
        setValue={setCategoria}
        list={categorias}
        visible={showDropdown}
        showDropDown={() => setShowDropdown(true)}
        hideDropDown={() => setShowDropdown(false)}
        mode="outlined"
        style={styles.dropdown}
        error={!!errores.categoria}
      />
      {errores.categoria && (
        <HelperText type="error">{errores.categoria}</HelperText>
      )}

      <TextInput
        label="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        error={!!errores.precio}
      />
      {errores.precio && <HelperText type="error">{errores.precio}</HelperText>}

      <TextInput
        label="Costo"
        value={costo}
        onChangeText={setCosto}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        error={!!errores.costo}
      />
      {errores.costo && <HelperText type="error">{errores.costo}</HelperText>}

      <TextInput
        label="Cantidad en Existencia"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="number-pad"
        mode="outlined"
        style={styles.input}
        error={!!errores.cantidad}
      />
      {errores.cantidad && (
        <HelperText type="error">{errores.cantidad}</HelperText>
      )}

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Agregar Artículo
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  dropdown: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
});

export default AddProductScreen;
