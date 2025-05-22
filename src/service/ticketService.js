import ServiceRegistry from './serviceRegistry';
import { supabase } from './supabase-config';

export const fetchWithTimeout = async (operation, timeout = 5000) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout); // Cancela si excede el tiempo

  try {
    const response = await operation(signal); // Pasar el `signal` para abortar si es necesario
    return response;
  } catch (error) {
    console.error('Error o timeout:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
class TicketService {
  static async save(data) {
    try {
      console.log('order=>', data);
      const { error } = await fetchWithTimeout(async (signal) => {
        return await supabase.from('order').insert(data).abortSignal(signal);
      });
      if (error) throw error;
    } catch (error) {
      console.log('Error in TicketService->save ', error);
      throw error;
    }
  }
  static async saveLines(_lines) {
    try {
      const lines = _lines.map(({ product, ...line }) => ({
        ...line,
        product_id: product.id, // Solo conserva el `id` de `product`
      }));
      console.log('lines=>', lines);
      const { error } = await fetchWithTimeout(async (signal) => {
        return await supabase
          .from('orderline')
          .insert(lines)
          .abortSignal(signal);
      });

      if (error) throw error;
    } catch (error) {
      console.log('Error in TicketService->saveLines ', error);
      throw error;
    }
  }
  static async savePayments(payments) {
    try {
      console.log('payments=>', payments);
      const { error } = await fetchWithTimeout(async (signal) => {
        return await supabase
          .from('payment')
          .insert(payments)
          .abortSignal(signal);
      });
      if (error) throw error;
    } catch (error) {
      console.log('Error in TicketService->savePayments ', error);
      throw error;
    }
  }

  static getName() {
    return 'order';
  }
}

ServiceRegistry.register(TicketService);
export default TicketService;
