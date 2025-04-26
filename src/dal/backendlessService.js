import axios from 'axios';

const BACKENDLESS_APP_ID = '<TU_APP_ID>';
const BACKENDLESS_API_KEY = '<TU_API_KEY>';
const BACKENDLESS_API_URL = `https://suasivesugar-us.backendless.app/api`;

class BackendlessService {
  async fetchProducts() {
    try {
      const response = await axios.get(
        `${BACKENDLESS_API_URL}/data/product?loadRelations=category`
      );
      return response.data.map((p) => ({
        ...p,
        category: p.category?.id,
      }));
    } catch (err) {
      console.log('Error obteniendo producto: ', err);
      throw err;
    }
  }
  async fetchCategories() {
    try {
      const response = await axios.get(`${BACKENDLESS_API_URL}/data/category`);

      return response.data;
    } catch (err) {
      console.log('Error obteniendo categorias: ', err);
      throw err;
    }
  }
  async addProduct(data) {
    try {
      if (data.saveNewImage) {
        const imageUri = await this.uploadImage(
          data.image,
          data.name.replaceAll(' ', '_') + '.jpeg'
        );
        data.image = imageUri;
      }
      //Guardar el producto
      await axios.post(`${BACKENDLESS_API_URL}/data/product`, data);
    } catch (err) {
      console.log('Error adicionando producto: ', err);
      throw err;
    }
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
    const response = await axios.post(
      `${BACKENDLESS_API_URL}/files/${imageName}?overwrite=true`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.fileURL;
  }
}
export default BackendlessService;
