import ServiceRegistry from './serviceRegistry';
import BackendFactory from './backendFactory';

class TicketService {
  static async add(data) {
    try {
      const lines = data.lines.map((line) => ({
        ...line,
        product: { id: line.product.id }, // Solo conserva el `id` de `product`
      }));
      const ticket = {
        ...data,
        lines,
      };
      const { payments, ..._ticket } = ticket;
      console.log('lines=>', JSON.stringify(_ticket, null, 2));
      //console.log('ticket service=>', ticket);
      await BackendFactory.getInstance().addOrder(_ticket);
    } catch (error) {
      console.log('Error in TicketService->add ', error);
      throw error;
    }
  }

  static getName() {
    return 'order';
  }
}

ServiceRegistry.register(TicketService);
export default TicketService;
