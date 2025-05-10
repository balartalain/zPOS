import ServiceRegistry from './serviceRegistry';
//import BackendFactory from './backendFactory';
import { supabase, storageUrl } from './supabase-config';

export async function uploadImage(imageUri, imageName) {
  const arraybuffer = await fetch(imageUri).then((res) => res.arrayBuffer());
  //const fileExt = imageUri?.split('.').pop()?.toLowerCase() ?? 'jpeg';

  const { data, error: uploadError } = await supabase.storage
    .from('files')
    .upload(imageName, arraybuffer, {
      contentType: 'image/jpeg',
    });
  if (uploadError) {
    throw uploadError;
  }
  return data.path;
}
class ProductService {
  static async save(data) {
    try {
      const { error } = await supabase.from('product').upsert(data);
      if (error) throw error;
    } catch (error) {
      console.log('Error in ProductService->save ', error);
      throw error;
    }
  }
  static async saveImage({ imageUri, imageName }) {
    try {
      return await uploadImage(imageUri, imageName);
    } catch (error) {
      console.log('saveImage Error=>', error);
      throw error;
    }
  }
  // static async update(data) {
  //   try {
  //     const { error } = await supabase.from('product').upsert(data);
  //     if (error) throw error;
  //   } catch (error) {
  //     console.log('Error in ProductService->update ', error);
  //     throw error;
  //   }
  // }
  static async fetchAll() {
    try {
      const { data, error } = await supabase.from('product').select();
      if (error) throw error;
      return data.map((product) => ({
        ...product,
        image: product.image ? `${storageUrl}/${product.image}` : null,
      }));
    } catch (error) {
      console.log('Error in ProductService->fetchAll ', error);
      throw error;
    }
  }
  static async delete(id) {
    try {
      const response = await supabase.from('product').delete().eq('id', id);
      console.log(response);
    } catch (error) {
      console.log('Error in ProductService->delete ', error);
      throw error;
    }
  }
  static getName() {
    return 'product';
  }
}

ServiceRegistry.register(ProductService);
export default ProductService;
