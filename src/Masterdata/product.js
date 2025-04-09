import AsyncStorage from '@react-native-async-storage/async-storage';
import BackendFactory from '@/src/dal/backendFactory';

const PRODUCTS_KEY = 'product-storage'; // Clave en AsyncStorage
const asyncAwait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout || 3000);
  });
};

const ProductManager = {
  // 🔄 Cargar productos desde el servidor (solo primera vez)
  async loadProductsFromServer() {
    try {
      const backend = BackendFactory.getBackend();
      const products = await backend.fetchProducts();
      console.log(products);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      console.log('✅ Productos almacenados en AsyncStorage.');
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
    }
  },
  async findAll() {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      return products;
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
      return [];
    }
  },
  // 🔍 Buscar productos por nombre o código
  async findProduct(query) {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.code.includes(query)
      );
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
      return [];
    }
  },

  // ➕ Agregar un nuevo producto a la lista
  async addProduct(product) {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      products.push(product);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      console.log('✅ Producto agregado.');
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  },

  // 🔄 Actualizar un producto existente
  async updateProduct(productId, updatedData) {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      const updatedProducts = products.map((p) =>
        p.id === productId ? { ...p, ...updatedData } : p
      );
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
      console.log('✅ Producto actualizado.');
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
    }
  },
};

export default ProductManager;
