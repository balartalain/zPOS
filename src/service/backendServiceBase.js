export default class BackendServiceBase {
  constructor() {
    if (this.constructor === BackendServiceBase) {
      throw new Error(
        'No se puede instanciar la clase abstracta "BackendService".'
      );
    }
  }
  fetchProducts() {
    throw new Error(
      'El método "fetchProducts" debe ser implementado en la clase hija.'
    );
  }
  addProduct(data) {
    throw new Error(
      'El método "addProduct" debe ser implementado en la clase hija.'
    );
  }
  updateProduct(data) {
    throw new Error(
      'El método "updateProduct" debe ser implementado en la clase hija.'
    );
  }
  deleteProduct(id) {
    throw new Error(
      'El método "deleteProduct" debe ser implementado en la clase hija.'
    );
  }
  fetchCategories() {
    throw new Error(
      'El método "fetchCategories" debe ser implementado en la clase hija.'
    );
  }
  addCategory(data) {
    throw new Error(
      'El método "addCategory" debe ser implementado en la clase hija.'
    );
  }
  updateCategory(data) {
    throw new Error(
      'El método "updateCategory" debe ser implementado en la clase hija.'
    );
  }
  deleteCategory(id) {
    throw new Error(
      'El método "deleteCategory" debe ser implementado en la clase hija.'
    );
  }
}
