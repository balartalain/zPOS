import { FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
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
import { useData } from '@/src/context/dataContext';
import SharedView from '@/src/components/shared/sharedView';
import { Utils } from '@/src/utils';
import { eventBus, eventName } from '@/src/event/eventBus';
import { useHeader } from '@/src/context/headerContext';

const { width } = Dimensions.get('window');
const NoImageIcon = require('@/assets/images/no-image.png');

function ProductListScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { loadProducts } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const { setHeaderContent, setHeaderActions } = useHeader();

  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent('Artículos');
      setHeaderActions(null);
    }
  }, [setHeaderContent, setHeaderActions, isFocused]);

  useEffect(() => {
    (async () => {
      setProductosFiltrados(await loadProducts());
    })();
    eventBus.on(eventName.CHANGED_PRODUCT, async () => {
      setProductosFiltrados(await loadProducts());
    });
    return () => {};
  }, [loadProducts]);

  const filtrarProductos = async (texto) => {
    const products = await loadProducts();
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
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            contentStyle={styles.innerCard}
            onPress={() => {
              router.push('/product/edit?id=' + item.id);
            }}
          >
            <Card.Title
              style={{ paddingLeft: 5, minHeight: 0, paddingVertical: 10 }}
              left={() => <LeftContentCard product={item} />}
            />
            <Card.Content style={styles.contentCard}>
              <Text variant="titleMedium">
                {item.name} - {Utils.formatCurrency(item.price)}
              </Text>
              <Text
                variant="bodyMedium"
                style={[item.in_stock === 0 && styles.outOfStock]}
              >
                stock: {item.in_stock}
              </Text>
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
        onPress={() => router.push('/product/add')}
      >
        Agregar
      </Button>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  addBtn: {
    height: width * 0.15,
    justifyContent: 'center',
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
  outOfStock: {
    color: 'red',
    textDecorationLine: 'line-through',
  },
});
export default ProductListScreen;
