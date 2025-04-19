import AsyncStorage from '@react-native-async-storage/async-storage';
import ModelRegistry from './modelRegistry';
import BackendService from '@/src/dal/backendService';

const registerPendingOperation = async (db, model, operation, data) => {
  console.log(data);
  const jsonData = JSON.stringify(data);
  await db.runAsync(
    `INSERT INTO pending_operation (model, operation, data) VALUES (?, ?, ?)`,
    [model, operation, jsonData]
  );
};

class ProductModel {
  static async create(data, localDB) {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      products.push(data);
      await AsyncStorage.setItem('products', JSON.stringify(products));
      registerPendingOperation(localDB, this.getName(), 'pushCreate', data);
      console.log('✅ Producto agregado 1.');
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  }
  static async update(id, data, localDB) {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      let products = storedProducts ? JSON.parse(storedProducts) : [];
      products = products.map((prod) =>
        prod.id === id ? { ...prod, ...data } : prod
      );
      await AsyncStorage.setItem('products', JSON.stringify(products));
      registerPendingOperation(localDB, this.getName(), 'pushUpdate', data);
      console.log('✅ Producto agregado.');
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  }
  static async delete(id, localDB) {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      const newProducts = products.filter((prod) => prod.id !== id);
      await AsyncStorage.setItem('products', JSON.stringify(newProducts));
      registerPendingOperation(localDB, this.getName(), 'pushDelete', { id });
      console.log('✅ Producto eliminado.');
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  }
  /* In Remote */
  static async fetchAll() {
    try {
      const products = await BackendService.fetchProducts();
      await AsyncStorage.setItem('products', JSON.stringify(products));
      console.log('✅ Productos almacenados en AsyncStorage.');
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
    }
  }
  static async pushCreate(data) {}
  static async pushUpdate(data) {}
  static async pushDelete(data) {}

  /* In AsyncStorage */
  static async findAll() {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      return products;
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
      return [];
    }
  }
  static getName() {
    return 'product';
  }
}

ModelRegistry.register(ProductModel);
export default ProductModel;
