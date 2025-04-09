import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useTicketStore = create(
  persist(
    (set, get) => ({
      ticket: { lines: [] }, // Ticket con líneas de productos
      sales: [], // Ventas almacenadas de los últimos 30 días
      isClosedStore: true,
      openShift: (initialCash) => {},
      // Agregar un producto al ticket
      addProductToTicket: (product) =>
        set((state) => {
          const existingProductIndex = state.ticket.lines.findIndex(
            (line) => line.product.id === product.id
          );

          let updatedLines;
          if (existingProductIndex !== -1) {
            // Si el producto ya está, incrementa su cantidad
            updatedLines = state.ticket.lines.map((line, index) =>
              index === existingProductIndex
                ? { ...line, qty: (line.qty || 1) + 1 }
                : line
            );
          } else {
            // Si no está, lo agrega con cantidad 1
            updatedLines = [
              ...state.ticket.lines,
              { product, qty: 1, id: state.ticket.lines.length + 1 },
            ];
          }

          return {
            ticket: {
              ...state.ticket,
              lines: updatedLines,
            },
          };
        }),

      // Calcular el monto total del ticket
      getTotal: () => {
        return get().ticket.lines.reduce(
          (total, line) => total + line.product.price * line.qty,
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
      name: 'ticket-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTicketStore;
