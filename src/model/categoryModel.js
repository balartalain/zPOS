import AsyncStorage from '@react-native-async-storage/async-storage';
import ModelRegistry from './modelRegistry';
import BackendService from '@/src/dal/backendService';
import { registerPendingOperation } from './productModel';

class CategoryModel {
  static async create(data, localDB) {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories = storedCategories ? JSON.parse(storedCategories) : [];
      categories.push(data);
      await AsyncStorage.setItem('categories', JSON.stringify(categories));
      this.syncCreate(data);
      //registerPendingOperation(localDB, this.getName(), 'syncCreate', data);
    } catch (error) {
      console.error('❌ Error al agregar la categoria:', error);
    }
  }
  // static async update(id, data, localDB) {
  //   try {
  //     const storedProducts = await AsyncStorage.getItem('products');
  //     let products = storedProducts ? JSON.parse(storedProducts) : [];
  //     products = products.map((prod) =>
  //       prod.id === id ? { ...prod, ...data } : prod
  //     );
  //     await AsyncStorage.setItem('products', JSON.stringify(products));
  //     registerPendingOperation(localDB, this.getName(), 'pushUpdate', data);
  //     console.log('✅ Producto agregado.');
  //   } catch (error) {
  //     console.error('❌ Error al agregar producto:', error);
  //   }
  // }
  // static async delete(id, localDB) {
  //   try {
  //     const storedProducts = await AsyncStorage.getItem('products');
  //     const products = storedProducts ? JSON.parse(storedProducts) : [];
  //     const newProducts = products.filter((prod) => prod.id !== id);
  //     await AsyncStorage.setItem('products', JSON.stringify(newProducts));
  //     registerPendingOperation(localDB, this.getName(), 'pushDelete', { id });
  //     console.log('✅ Producto eliminado.');
  //   } catch (error) {
  //     console.error('❌ Error al agregar producto:', error);
  //   }
  // }
  static async findAll() {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      return storedCategories ? JSON.parse(storedCategories) : [];
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
      return [];
    }
  }
  /* In Remote */
  static async fetchAll() {
    try {
      const categories = await BackendService.fetchCategories();
      //console.log('[categories] => ', categories);
      await AsyncStorage.setItem(
        'categories',
        categories ? JSON.stringify(categories) : JSON.stringify([])
      );
      console.log('✅ Categorias almacenados en AsyncStorage.');
    } catch (error) {
      await AsyncStorage.setItem('categories', JSON.stringify([]));
      console.error('❌ Error al cargar las categorias:', error);
    }
  }
  static async syncCreate(data) {
    BackendService.addProduct(data);
  }
  static async pushUpdate(data) {}
  static async pushDelete(data) {}

  static getName() {
    return 'category';
  }
}

ModelRegistry.register(CategoryModel);
export default CategoryModel;
