import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePOSStore = create()(
  persist(
    (set, get) => ({
      ticket: { lines: [] }, // Ticket con líneas de productos
      sales: [], // Ventas almacenadas de los últimos 30 días

      // Agregar un producto al ticket
      addProductToTicket: (product, quantity) =>
        set((state) => ({
          ticket: {
            ...state.ticket,
            lines: [...state.ticket.lines, { product, quantity }],
          },
        })),

      // Calcular el monto total del ticket
      getTotal: () => {
        return get().ticket.lines.reduce(
          (total, line) => total + line.product.price * line.quantity,
          0
        );
      },

      // Guardar venta en el historial (con fecha y sincronización pendiente)
      completeTicket: () => {
        const newSale = { ...get().ticket, date: new Date(), synced: false };
        set((state) => ({
          sales: [...state.sales, newSale], // Se guarda en la lista de ventas
          ticket: { lines: [] }, // Vacía el ticket después de finalizar la venta
        }));
      },

      // Marcar una venta como sincronizada después de enviarla al servidor
      markSaleAsSynced: (saleId) =>
        set((state) => ({
          sales: state.sales.map((sale) =>
            sale.date === saleId ? { ...sale, synced: true } : sale
          ),
        })),
    }),
    {
      name: 'pos-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePOSStore;
