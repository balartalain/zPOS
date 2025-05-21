import ServiceRegistry from './serviceRegistry';
import { supabase } from './supabase-config';
import { fetchWithTimeout } from './ticketService';
class CategoryService {
  static async save(data) {
    try {
      const { error } = await fetchWithTimeout(async (signal) => {
        return await supabase.from('category').upsert(data).abortSignal(signal);
      });
      if (error) throw error;
    } catch (error) {
      //console.log('Error in CategoryService->save ', error);
      throw error;
    }
  }
  static async fetchAll() {
    try {
      const { data, error } = await fetchWithTimeout(async (signal) => {
        return await supabase.from('category').select().abortSignal(signal);
      });
      if (error) throw error;
      return data;
    } catch (error) {
      //console.log('Error in CategoryService->fetchAll ', error);
      throw error;
    }
  }
  static async delete(id) {
    try {
      const { error } = await fetchWithTimeout(async (signal) => {
        return await supabase
          .from('category')
          .delete()
          .eq('id', id)
          .abortSignal(signal);
      });
      if (error) throw error;
    } catch (error) {
      //console.log('Error in CategoryService->delete ', error);
      throw error;
    }
  }
  static getName() {
    return 'category';
  }
}

ServiceRegistry.register(CategoryService);
export default CategoryService;
