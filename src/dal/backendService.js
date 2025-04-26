import BackendlessService from './backendlessService';
//import SupabaseService from './supabaseService'; // Implementación similar

const backend = 'backendless'; // Puedes cambiar esto según el backend activo
let backendService;
if (backend === 'appwrite') {
  backendService = new AppwriteService();
}
if (backend === 'backendless') {
  backendService = new BackendlessService();
}
if (backend === 'supabase') {
  //backendService = new FirebaseService();
  //backendService = new SupabaseService();
}
const BackendService = {
  fetchProducts: async function () {
    return await backendService.fetchProducts();
  },
  addProduct: async function (product) {
    return await backendService.addProduct(product);
  },
  fetchCategories: async function () {
    return await backendService.fetchCategories();
  },
};
export default BackendService;
