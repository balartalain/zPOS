import AppwriteService from './appWriteService';
//import SupabaseService from './supabaseService'; // Implementación similar

const backend = 'appwrite'; // Puedes cambiar esto según el backend activo
let backendService;
if (backend === 'appwrite') backendService = new AppwriteService();
if (backend === 'firebase')
  if (backend === 'supabase') {
    //backendService = new FirebaseService();
    //backendService = new SupabaseService();
  }
const BackendService = {
  fetchProducts: async function () {
    return await backendService.fetchProducts();
  },
  addProduct: async function (product) {
    await backendService.addProduct(product);
  },
  uploadImage: async function (imageAsset) {
    await backendService.uploadImage(imageAsset);
  },
};
export default BackendService;
