import ServiceRegistry from './serviceRegistry';
//import BackendFactory from './backendFactory';
import { supabase } from './supabase-config';
// export const registerPendingOperation = async (db, model, operation, data) => {
//   console.log(data);
//   const jsonData = JSON.stringify(data);
//   await db.runAsync(
//     `INSERT INTO pending_operation (model, operation, data) VALUES (?, ?, ?)`,
//     [model, operation, jsonData]
//   );
// };

class CategoryService {
  static async save(data) {
    try {
      //const { data, error } = await supabase.from('product').insert([_data]);
      const { error } = await supabase.from('category').upsert(data);
      if (error) throw error;
    } catch (error) {
      console.log('Error in CategoryService->save ', error);
      throw error;
    }
  }
  // static async update(data) {
  //   try {
  //     const { error } = await supabase.from('category').upsert(data);
  //     if (error) throw error;
  //   } catch (error) {
  //     console.log('Error in CategoryService->update ', error);
  //     throw error;
  //   }
  // }
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
      const response = await supabase.from('category').delete().eq('id', id);
      console.log(response);
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
