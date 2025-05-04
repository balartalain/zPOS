import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Utils from '@/src/utils/utils';
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
            (line) => line.product.objectId === product.objectId
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
            // state.ticket.lines.length + 1
            // Si no está, lo agrega con cantidad 1
            updatedLines = [
              ...state.ticket.lines,
              { product, qty: 1, objectId: Utils.uniqueID() },
            ];
          }

          return {
            ticket: {
              ...state.ticket,
              lines: updatedLines,
              totalAmt:
                state.ticket.lines.reduce(
                  (total, line) => total + line.product.price * line.qty,
                  0
                ) + product.price,
            },
          };
        }),

      // Calcular el monto total del ticket
      getTotal: () => {
        console.log();
        return get().ticket.totalAmt;
      },
      addPayment: (paymentMethod, amount) => {
        const existingPaymentIndex = state.ticket.payments.findIndex(
          (payment) => payment.paymentMethod === paymentMethod
        );

        let updatedPayments;
        if (existingPaymentIndex !== -1) {
          updatedPayments = state.ticket.payments.map((payment, index) =>
            index === existingPaymentIndex
              ? { ...payment, amount: payment.amount + amount }
              : payment
          );
        } else {
          // state.ticket.lines.length + 1
          // Si no está, lo agrega con cantidad 1
          updatedPayments = [
            ...state.ticket.payments,
            { name: paymentMethod, amount, objectId: Utils.uniqueID() },
          ];
        }

        return {
          ticket: {
            ...state.ticket,
            payments: updatedPayments,
          },
        };
      },
      // Guardar venta en el historial (con fecha y sincronización pendiente)
      completeTicket: () => {
        const newSale = {
          ...get().ticket,
          creationDate: new Date(),
          synced: false,
        };
        set((state) => ({
          sales: [...state.sales, newSale], // Se guarda en la lista de ventas
          ticket: {
            lines: [],
            payments: [],
            totalAmt: 0,
            objectId: Utils.uniqueID(),
          }, // Vacía el ticket después de finalizar la venta
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
      name: 'order',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTicketStore;
