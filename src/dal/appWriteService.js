import { Client, Databases, Storage, ID } from 'appwrite';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Utils from '../utils/utils';

const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  project: '67ddae63002483677008',
};
const databaseId = '67ddae9d000dea8a9094';
const storageId = '67fec66b0023f738b876';
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.project);
const databases = new Databases(client);
const storage = new Storage(client);

async function createDocument(collectionId, data) {
  try {
    data.category = '67fb32da002978190dac';
    const { id, ...newData } = data;
    console.log(newData);
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      data.id,
      newData
    );
    console.log('Document created:', response);
  } catch (error) {
    console.error('Error creating document:', error);
  }
}
async function listDocuments(collectionId) {
  try {
    const documents = await databases.listDocuments(databaseId, collectionId);
    //console.log('Documents retrieved:', documents);
    return documents.documents;
  } catch (error) {
    console.error('Error retrieving documents:', error);
  }
}
// Read a document
async function getDocument(collectionId, documentId) {
  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
    console.log('Document retrieved:', document);
  } catch (error) {
    console.error('Error retrieving document:', error);
  }
}

async function updateDocument(collectionId, documentId, data) {
  try {
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data
    );
    console.log('Document updated:', response);
  } catch (error) {
    console.error('Error updating document:', error);
  }
}

async function deleteDocument(collectionId, documentId) {
  try {
    await databases.deleteDocument(databaseId, collectionId, documentId);
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
}

class AppwriteService {
  async fetchProducts() {
    try {
      const products = await listDocuments('67ddaeb40006089d52e7');
      for (const p of products) {
        if (p.image) {
          p.image = storage.getFileView(storageId, p.image);
        }
      }
      return products.map((p) => ({
        id: p.$id,
        name: p.name,
        image: p.image,
        category: p.category?.$id,
        price: p.price,
        cost: p.cost,
        inStock: p.inStock,
        createdAt: p.$createdAt,
        updatedAt: p.$updatedAt,
      }));
    } catch (err) {
      console.log('Error obteniendo producto: ', err);
    }
  }
  async addProduct(data) {
    const { imageAsset: undefined, ...newProduct } = data;
    if (imageAsset) {
      newProduct.image = await this.uploadImage(imageAsset);
    }
    await createDocument('67ddaeb40006089d52e7', newProduct);
  }
  async createOrder(orderData) {
    throw new Error('Método no implementado');
  }

  async getUserData(userId) {
    throw new Error('Método no implementado');
  }
  async uploadImage(imageAsset) {
    try {
      const imageId = Utils.uniqueID();
      const imageUri =
        Platform.OS === 'web'
          ? imageAsset.file
          : await this.prepareNativeFile(imageAsset);
      const response = await storage.createFile(storageId, imageId, imageUri);
      console.log(response);
      return response.$id;
    } catch (error) {
      console.error('Error al subir la imagen a Appwrite:', error);
      return null;
    }
  }
  async prepareNativeFile(imageAsset) {
    try {
      //console.log(imageAsset);
      const url = new URL(imageAsset.uri);
      const fileInfo = await FileSystem.getInfoAsync(url.href);
      console.log('Información del archivo:', fileInfo);
      // Handle native file preparation
      return {
        name: url.pathname.split('/').pop(),
        size: imageAsset.fileSize,
        type: imageAsset.mimeType,
        uri: url.href,
      };
      //console.log(imageAsset);
      console.log(result);
      return result;
    } catch (error) {
      console.error('[prepareNativeFile] error ==>', error);
      return Promise.reject(error);
    }
  }
}

export default AppwriteService;
