import { Client, Databases, Storage, ID } from 'appwrite';

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
  async addProduct(p) {
    const { image, ...newP } = p;
    await createDocument('67ddaeb40006089d52e7', newP);
  }
  async createOrder(orderData) {
    throw new Error('Método no implementado');
  }

  async getUserData(userId) {
    throw new Error('Método no implementado');
  }
}

export default AppwriteService;
