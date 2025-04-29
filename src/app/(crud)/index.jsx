import { FlatList, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Text,
  Surface,
  useTheme,
  TextInput,
  Card,
} from 'react-native-paper';
import ProductModel from '../../model/productModel';

import SharedView from '@/src/components/shared/sharedView';
const NoImageIcon = require('@/assets/images/no-image.png');

function ProductScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    (async () => {
      const products = await ProductModel.findAll();
      setProductosFiltrados(products);
    })();
  }, []);
  const filtrarProductos = async (texto) => {
    const products = await ProductModel.findAll();
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
  const LeftContentCard = ({ product }) => (
    <Image
      source={product.image ? { uri: product.image } : NoImageIcon}
      //source={product.image}
      style={styles.productImage}
    />
  );
  return (
    <SharedView>
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
            onPress={() => {
              router.push('/add?productId=' + item.id);
            }}
          >
            <Card.Title
              style={{ paddingLeft: 5, minHeight: 0, paddingVertical: 10 }}
              left={() => <LeftContentCard product={item} />}
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
      <Button
        mode="contained"
        style={styles.addBtn}
        onPress={() => router.push('/addProduct')}
      >
        Agregar
      </Button>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  addBtn: {
    padding: 10,
    marginTop: 10,
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
    backgroundColor: '#ccc',
    resizeMode: 'cover',
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
export default ProductScreen;
