import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';
import ProductManager from '../Masterdata/product';

export default function ProductList({ onPress }) {
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto del buscador
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    (async () => {
      const products = await ProductManager.findAllProducts();
      setProductosFiltrados(products);
    })();
  }, []);

  // Función para manejar la búsqueda y filtrar los productos
  const filtrarProductos = async (texto) => {
    const products = await ProductManager.findAllProducts();
    setBusqueda(texto);
    if (texto === '') {
      setProductosFiltrados(products); // Mostrar todos si el buscador está vacío
    } else {
      setProductosFiltrados(
        products.filter((producto) =>
          producto.nombre.toLowerCase().includes(texto.toLowerCase())
        )
      );
    }
  };
  const LeftContentCard = (props) => <Avatar.Icon {...props} icon="folder" />;
  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        label="Buscar productos"
        type="flat"
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
          <Card
            style={styles.card}
            contentStyle={styles.innerCard}
            left={LeftContentCard}
            onPress={() => onPress(item)}
          >
            <Card.Content style={styles.contentCard}>
              <Text variant="titleMedium">
                {item.nombre} - ${item.precio}
              </Text>
              <Text variant="bodyMedium">stock: {item.inStock}</Text>
            </Card.Content>
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
  innerCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentCard: {
    //addingTop: 5
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    // color: '#999',
  },
});
