import AsyncStorage from '@react-native-async-storage/async-storage';
import BackendService from '@/src/dal/backendService';

const PRODUCTS_KEY = 'product-storage'; // Clave en AsyncStorage
const asyncAwait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout || 3000);
  });
};
const products1 = [
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237539',
    inStock: 10,
    name: 'Refresco Cola 1',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237538',
    inStock: 10,
    name: 'Refresco Cola 2',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237537',
    inStock: 10,
    name: 'Refresco Cola 3',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237536',
    inStock: 10,
    name: 'Refresco Cola 4',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237535',
    inStock: 10,
    name: 'Refresco Cola 5',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237534',
    inStock: 10,
    name: 'Refresco Cola 6',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237533',
    inStock: 10,
    name: 'Refresco Cola 7',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 120,
    createdAt: '2025-03-21T18:29:23.046+00:00',
    id: '67ddb002003703237532',
    inStock: 10,
    name: 'Refresco Cola 8',
    price: 180,
    updatedAt: '2025-03-21T18:29:23.046+00:00',
  },
  {
    cost: 200,
    createdAt: '2025-04-09T11:21:22.248+00:00',
    id: '67f65832000571c696d7',
    inStock: 10,
    name: 'Cerveza cristal',
    price: 250,
    updatedAt: '2025-04-09T11:21:22.248+00:00',
  },
];
const ProductManager = {
  // 🔄 Cargar productos desde el servidor (solo primera vez)
  async loadProductsFromServer() {
    try {
      const products = await BackendService.fetchProducts();

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
