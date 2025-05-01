import ServiceRegistry from './serviceRegistry';
import BackendFactory from './backendFactory';
export const registerPendingOperation = async (db, model, operation, data) => {
  console.log(data);
  const jsonData = JSON.stringify(data);
  await db.runAsync(
    `INSERT INTO pending_operation (model, operation, data) VALUES (?, ?, ?)`,
    [model, operation, jsonData]
  );
};

class ProductService {
  static async add(data) {
    try {
      await BackendFactory.getInstance().addProduct(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async update(data) {
    try {
      await BackendFactory.getInstance().updateProduct(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async fetchAll() {
    try {
      const products = await BackendFactory.getInstance().fetchProducts();
      return products;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  static async delete(id) {
    try {
      await BackendFactory.getInstance().deleteProduct(id);
    } catch (error) {
      console.log(error);
    }
  }
  static getName() {
    return 'product';
  }
}

ServiceRegistry.register(ProductService);
export default ProductService;
