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
    }
  }
  async addProduct(data) {
    if (data.saveNewImage) {
      const imageUri = await this.uploadImage(
        data.image,
        data.name.replaceAll(' ', '_') + '.jpeg'
      );
      data.image = imageUri;
    }
    //Guardar el producto
    try {
      await axios.post(`${BACKENDLESS_API_URL}/data/product`, data);
    } catch (err) {
      console.log('Error obteniendo producto: ', err);
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
  // async getUserData(userId) {
  //   throw new Error('Método no implementado');
  // }
  // async uploadImage(imageAsset) {
  //   try {
  //     const imageId = Utils.uniqueID();
  //     const imageFile =
  //       Platform.OS === 'web'
  //         ? imageAsset.file
  //         : await this.prepareNativeFile(imageAsset);

  //     const rBlob = await fetch(imageAsset.uri);
  //     const blob = await rBlob.blob();
  //     //console.log(blob);
  //     const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  //     console.log(file);
  //     const response = await storage.createFile(storageId, imageId, file);
  //     return response.$id;
  //   } catch (error) {
  //     console.log('Error al subir la imagen a Appwrite:', error);
  //     return null;
  //   }
  // }
}
export default BackendlessService;
