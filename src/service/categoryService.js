import ServiceRegistry from './serviceRegistry';
import BackendFactory from './backendFactory';

class CategoryService {
  static async add(data) {
    try {
      await BackendFactory.getInstance().addCategory(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async update(data) {
    try {
      await BackendFactory.getInstance().updateCategory(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async fetchAll() {
    try {
      console.log('fetch categ');
      return await BackendFactory.getInstance().fetchCategories();
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  static async delete(id) {
    try {
      await BackendFactory.getInstance().deleteCategory(id);
    } catch (error) {
      console.log(error);
    }
  }
  static getName() {
    return 'category';
  }
}

ServiceRegistry.register(CategoryService);
export default CategoryService;
