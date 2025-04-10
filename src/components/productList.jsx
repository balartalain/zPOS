import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';
import ProductManager from '../Masterdata/product';

const NoImageIcon = require('@/assets/images/no-image.png');

export default function ProductList({ onPress }) {
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto del buscador
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    (async () => {
      const products = await ProductManager.findAll();
      setProductosFiltrados(products);
    })();
  }, []);

  // Función para manejar la búsqueda y filtrar los productos
  const filtrarProductos = async (texto) => {
    const products = await ProductManager.findAll();
    setBusqueda(texto);
    if (texto === '') {
      setProductosFiltrados(products); // Mostrar todos si el buscador está vacío
    } else {
      setProductosFiltrados(
        products.filter((product) =>
          product.name.toLowerCase().includes(texto.toLowerCase())
        )
      );
    }
  };
  const LeftContentCard = (props) => (
    <Image source={NoImageIcon} {...props} style={styles.productImage} />
  );
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
            onPress={() => onPress(item)}
          >
            <Card.Title
              style={{ paddingLeft: 5, minHeight: 0, paddingVertical: 10 }}
              left={LeftContentCard}
            />
            <Card.Content style={styles.contentCard}>
              <Text variant="titleMedium">
                {item.name} - ${item.price}
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
  productImage: {
    width: 50,
    height: 50,
    //marginRight: 12,
    borderRadius: 4,
    backgroundColor: '#ccc', // Color de fondo si la imagen no carga
  },
  innerCard: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
  },
  contentCard: {
    paddingLeft: 0,
    paddingBottom: 0,
    marginLeft: 10,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    // color: '#999',
  },
});
