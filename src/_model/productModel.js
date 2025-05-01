/*import AsyncStorage from '@react-native-async-storage/async-storage';
import ModelRegistry from './modelRegistry';
import BackendService from '@/src/service/backendService';

export const registerPendingOperation = async (db, model, operation, data) => {
  console.log(data);
  const jsonData = JSON.stringify(data);
  await db.runAsync(
    `INSERT INTO pending_operation (model, operation, data) VALUES (?, ?, ?)`,
    [model, operation, jsonData]
  );
};

class ServiceBase {
  constructor() {
    if (this.constructor === ServiceBase) {
      throw new Error(
        'No se puede instanciar la clase abstracta "ServiceBase".'
      );
    }
  }
  add(data) {
    throw new Error('El método "add" debe ser implementado en la clase hija.');
  }
  update(data) {
    throw new Error(
      'El método "update" debe ser implementado en la clase hija.'
    );
  }
  delete(id) {
    throw new Error(
      'El método "delete" debe ser implementado en la clase hija.'
    );
  }
  fetchAll() {
    throw new Error(
      'El método "fetchAll" debe ser implementado en la clase hija.'
    );
  }
}
class ProductModel {
  static async create(data, localDB) {
    try {
      const { saveNewImage, ...newProduct } = data;
      const storedProducts = await AsyncStorage.getItem('product');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      products.push(newProduct);
      await AsyncStorage.setItem('product', JSON.stringify(products));
      this.syncCreate(data);
      //registerPendingOperation(localDB, this.getName(), 'syncCreate', data);
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  }
  static async update(data, localDB) {
    try {
      const { saveNewImage, ...product } = data;

      const storedProducts = await AsyncStorage.getItem('product');
      let products = storedProducts ? JSON.parse(storedProducts) : [];
      products = products.map((prod) =>
        prod.id === data.id ? { ...prod, ...product } : prod
      );
      await AsyncStorage.setItem('product', JSON.stringify(products));
      this.syncCreate(data);
      //registerPendingOperation(localDB, this.getName(), 'pushUpdate', data);
    } catch (error) {
      console.error('❌ Error al actualizar el producto:', error);
    }
  }
  static async delete(id, localDB) {
    try {
      const storedProducts = await AsyncStorage.getItem('product');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      const newProducts = products.filter((prod) => prod.id !== id);
      await AsyncStorage.setItem('product', JSON.stringify(newProducts));
      registerPendingOperation(localDB, this.getName(), 'pushDelete', { id });
      console.log('✅ Producto eliminado.');
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  }
  static async findAll() {
    try {
      const storedProducts = await AsyncStorage.getItem('product');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      return products;
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
      return [];
    }
  }
  static async findById(productId) {
    try {
      const storedProducts = await AsyncStorage.getItem('product');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      const p = products.find((p) => p.objectId === productId);
      return p;
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
      return [];
    }
  }

  static async fetchAll() {
    try {
      const products = await BackendService.fetchProducts();
      await AsyncStorage.setItem(
        'product',
        products ? JSON.stringify(products) : JSON.stringify([])
      );
      console.log('✅ Productos almacenados en AsyncStorage.');
    } catch (error) {
      await AsyncStorage.setItem('product', []);
      console.error('❌ Error al cargar productos:', error);
    }
  }
  static async syncCreate(data) {
    await BackendService.addOrUpdateProduct(data);
  }
  static async syncUpdate(data) {
    await BackendService.updateProduct(data);
  }
  static async pushUpdate(data) {}
  static async pushDelete(data) {}

  static getName() {
    return 'product';
  }
}

ModelRegistry.register(ProductModel);
export default ProductModel;
*/
