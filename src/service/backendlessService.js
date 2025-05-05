/* eslint-disable no-unused-vars */
import apiAxios from './apiAxios';
import BackendServiceBase from './backendServiceBase';

class BackendlessService extends BackendServiceBase {
  async get(table, query) {
    const encodedQuery = encodeURIComponent(query);
    const response = await apiAxios.post(
      `/data/${table}?where=${encodedQuery}`
    );
    return response.data;
  }
  async fetchProducts() {
    const response = await apiAxios.get(`/data/product?loadRelations=category`);
    return response.data;
    // return response.data.map((p) => ({
    //   ...p,
    //   category: p.category?.id || null,
    // }));
  }
  /* Product */
  async addProduct(data) {
    if (data.saveNewImage) {
      const imageUri = await this.uploadImage(
        data.image,
        data.name.replaceAll(' ', '_') + '.jpeg'
      );
      data.image = imageUri;
    }
    const {
      saveNewImage,
      ___class,
      created,
      updated,
      ownerId,
      category,
      ...product
    } = data;
    await apiAxios.put('/data/product/upsert', product);
    if (data.category) {
      await this.setCategory(data.objectId, data.category);
    }
  }
  async updateProduct(data) {
    await this.addProduct(data);
  }
  async setCategory(productId, category) {
    if (category) {
      await apiAxios.post(`/data/product/${productId}/category`, [category]);
    }
  }
  /* Category */
  async fetchCategories() {
    const response = await apiAxios.get(`/data/category`);
    return response.data;
  }
  async addCategory(data) {
    const { ___class, created, updated, ownerId, ...category } = data;
    await apiAxios.put('/data/category/upsert', category);
  }
  async updateCategory(data) {
    await this.addCategory(data);
  }
  async createOrder(orderData) {
    throw new Error('Método no implementado');
  }
  async uploadImage(imageURL, imageName) {
    const formData = new FormData();
    formData.append('file', {
      uri: imageURL,
      name: imageName,
      type: 'image/jpeg',
    });
    const response = await apiAxios.post(
      `/files/${imageName}?overwrite=true`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.fileURL;
  }
}
export default BackendlessService;
