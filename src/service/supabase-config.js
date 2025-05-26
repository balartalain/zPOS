import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

// Variables de conexión
const SUPABASE_URL = 'https://bpkmwpaueehhipiomlnf.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa213cGF1ZWVoaGlwaW9tbG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1ODA1ODYsImV4cCI6MjA1ODE1NjU4Nn0.JaNjSjJNeGg8GZiWRhFv7boyCrcgetJ7B7FxjoJ6BvU';

export const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/files`;
// Crear instancia del cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
// class ProductService {
//   static async getProducts() {
//     const { data, error } = await supabase.from('products').select('*');
//     if (error) throw error;
//     return data.map((item) => new Product(item)); // Convierte a instancias de `Product`
//   }
// }
