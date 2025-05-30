import ServiceRegistry from './serviceRegistry';
import { supabase } from './supabase-config';
class CategoryService {
  static async save(data) {
    try {
      const { error } = await supabase.from('category').upsert(data);
      if (error) throw error;
    } catch (error) {
      console.log('Error in CategoryService->save ', error);
      throw error;
    }
  }
  static async fetchAll() {
    try {
      const { data, error } = await supabase.from('category').select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error in CategoryService->fetchAll ', error);
      throw error;
    }
  }
  static async delete(id) {
    try {
      const { error } = await supabase.from('category').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.log('Error in CategoryService->delete ', error);
      throw error;
    }
  }
  static getName() {
    return 'category';
  }
}

ServiceRegistry.register(CategoryService);
export default CategoryService;
