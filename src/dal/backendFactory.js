import AppwriteService from './appWriteService';
//import SupabaseService from './supabaseService'; // Implementación similar

const backend = 'appwrite'; // Puedes cambiar esto según el backend activo

class BackendFactory {
  static instance = null;

  static getBackend() {
    if (!BackendFactory.instance) {
      if (backend === 'appwrite')
        BackendFactory.instance = new AppwriteService();
      if (backend === 'firebase')
        BackendFactory.instance = new FirebaseService();
      if (backend === 'supabase')
        BackendFactory.instance = new SupabaseService();
    }
    return BackendFactory.instance;
  }
}

export default BackendFactory;

/*
Use: 
  const backend = BackendFactory.getBackend();
  const products = await backend.fetchProducts();
*/
