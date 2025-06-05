import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';
//import ProductManager from '../Masterdata/product';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';
import useProductAnimStore from '../store/useProductAnimStore';
import { useData } from '../context/dataContext';
import { eventBus } from '../event/eventBus';
import { Utils } from '@/src/utils';
import SharedText from './shared/sharedText';
import useWhyDidYouUpdate from '@/src/hooks/useWhyDidYouUpdate';
const NoImageIcon = require('@/assets/images/no-image.png');

function ProductList({ onPress, basketCoords }) {
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto del buscador
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const productRefs = useRef({});
  const productMeasure = useRef({});
  const { runAnimation } = useProductAnimStore();
  const { loadProducts } = useData();
  //console.log('product list');
  useWhyDidYouUpdate(
    'ProductList',
    { onPress, basketCoords },
    {
      busqueda,
      productosFiltrados,
      runAnimation,
      loadProducts,
    }
  );
  useEffect(() => {
    (async () => {
      console.log('Product List=>loadProducts');
      setProductosFiltrados(await loadProducts());
    })();
    eventBus.on('CHANGED_PRODUCT', async () => {
      console.log('Product List=>CHANGED_PRODUCT event');
      setProductosFiltrados(await loadProducts());
    });
  }, [loadProducts]);

  useEffect(() => {
    calculateProductMeasure();
  }, [productosFiltrados, calculateProductMeasure]);

  const onMyPress = React.useCallback(
    (item) => {
      if (item.in_stock > 0) {
        const { x, y } = productMeasure.current[item.id];
        const to = { x: basketCoords.x, y: basketCoords.y };
        runAnimation({ from: { x, y }, to });
        onPress(item);
      }
    },
    [onPress, runAnimation, basketCoords.x, basketCoords.y]
  );
  const calculateProductMeasure = React.useCallback(() => {
    productosFiltrados.forEach((p) => {
      productRefs.current[p.id].measureInWindow((x, y, width, height) => {
        productMeasure.current[p.id] = { x, y, width, height };
      });
    });
  }, [productosFiltrados]);
  const setProductRef = useCallback((ref, id) => {
    productRefs.current[id] = ref;
  }, []);
  // Función para manejar la búsqueda y filtrar los productos
  const filtrarProductos = async (texto) => {
    //console.log('filtrar products');
    const products = await AsyncStorageUtils.findAll('product');
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
      ref={(ref) => setProductRef(ref, product.id)}
      source={product.image ? { uri: product.image } : NoImageIcon}
      //source={product.image}
      style={styles.productImage}
    />
  );
  // console.log(productosFiltrados[0]?.image);
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
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Card
            style={[styles.card]}
            contentStyle={styles.innerCard}
            onPress={() => onMyPress(item)}
          >
            <Card.Content style={styles.contentCard}>
              <LeftContentCard product={item} />
              <View>
                <SharedText title={item.name} h6 />
                <SharedText
                  title={`stock: ${item.in_stock}`}
                  p
                  style={[
                    { marginTop: 2 },
                    item.in_stock === 0 ? styles.outOfStock : styles.inStock,
                  ]}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <SharedText h6 title={Utils.formatCurrency(item.price)} />
              </View>
            </Card.Content>
          </Card>
        )}
        onMomentumScrollEnd={calculateProductMeasure}
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
    marginRight: 10,
    //borderRadius: 4,
    //backgroundColor: '#ccc',
    resizeMode: 'cover',
  },
  innerCard: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
  },
  contentCard: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingLeft: 0,
    marginLeft: 10,
    justifyContent: 'space-between',
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
  inStock: {
    color: 'green',
    textDecorationLine: 'none',
  },
});
export default React.memo(ProductList);
