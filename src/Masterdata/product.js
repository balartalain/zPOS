import AsyncStorage from '@react-native-async-storage/async-storage';

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
      //const response = await fetch('https://api.example.com/products');
      //const products = await response.json();
      // Lista de productos
      const products = [
        { id: '1', nombre: 'Cerveza', precio: 25, inStock: 10 },
        { id: '2', nombre: 'Coca Cola', precio: 20, inStock: 1 },
        { id: '3', nombre: 'Agua Mineral', precio: 15, inStock: 2 },
        { id: '4', nombre: 'Hamburguesa', precio: 50, inStock: 10 },
        { id: '5', nombre: 'Papas Fritas', precio: 30, inStock: 8 },
        { id: '6', nombre: 'Malta', precio: 15, inStock: 14 },
        { id: '7', nombre: 'Chupa Chupa', precio: 50, inStock: 10 },
        { id: '8', nombre: 'Café', precio: 30, inStock: 10 },
        { id: '9', nombre: 'Pasta de tomate', precio: 30, inStock: 10 },
      ];
      await asyncAwait(3000);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      console.log('✅ Productos almacenados en AsyncStorage.');
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
    }
  },
  async findAllProducts() {
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
