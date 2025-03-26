import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';

// Lista de productos
const productos = [
  { id: '1', nombre: 'Cerveza', precio: 25 },
  { id: '2', nombre: 'Coca Cola', precio: 20 },
  { id: '3', nombre: 'Agua Mineral', precio: 15 },
  { id: '4', nombre: 'Hamburguesa', precio: 50 },
  { id: '5', nombre: 'Papas Fritas', precio: 30 },
  { id: '6', nombre: 'Malta', precio: 15 },
  { id: '7', nombre: 'Chupa Chupa', precio: 50 },
  { id: '8', nombre: 'Café', precio: 30 },
];

export default function ProductList() {
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto del buscador
  const [productosFiltrados, setProductosFiltrados] = useState(productos);

  // Función para manejar la búsqueda y filtrar los productos
  const filtrarProductos = (texto) => {
    setBusqueda(texto);
    if (texto === '') {
      setProductosFiltrados(productos); // Mostrar todos si el buscador está vacío
    } else {
      setProductosFiltrados(
        productos.filter((producto) =>
          producto.nombre.toLowerCase().includes(texto.toLowerCase())
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        label="Buscar productos"
        value={busqueda}
        onChangeText={filtrarProductos}
        mode="outlined"
        style={styles.input}
      />

      {/* Lista de productos */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.nombre}
              subtitle={`Precio: $${item.precio}`}
            />
          </Card>
        )}
      />

      {/* Mensaje si no hay productos */}
      {productosFiltrados.length === 0 && (
        <Text style={styles.emptyText}>No se encontraron productos</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#f5f5f5',
  },
  input: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
   // color: '#999',
  },
});
