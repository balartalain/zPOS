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
  addProduct() {
    throw new Error(
      'El método "addProduct" debe ser implementado en la clase hija.'
    );
  }
  updateProduct() {
    throw new Error(
      'El método "updateProduct" debe ser implementado en la clase hija.'
    );
  }
  deleteProduct() {
    throw new Error(
      'El método "deleteProduct" debe ser implementado en la clase hija.'
    );
  }
  fetchCategories() {
    throw new Error(
      'El método "fetchCategories" debe ser implementado en la clase hija.'
    );
  }
  addCategory() {
    throw new Error(
      'El método "addCategory" debe ser implementado en la clase hija.'
    );
  }
  updateCategory() {
    throw new Error(
      'El método "updateCategory" debe ser implementado en la clase hija.'
    );
  }
  deleteCategory() {
    throw new Error(
      'El método "deleteCategory" debe ser implementado en la clase hija.'
    );
  }
}
