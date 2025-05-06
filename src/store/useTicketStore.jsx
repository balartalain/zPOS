import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Utils from '@/src/utils/utils';
const useTicketStore = create(
  persist(
    (set, get) => ({
      ticket: { lines: [], payments: [], totalAmt: 0, totalPaid: 0 }, // Ticket con líneas de productos
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
              totalAmt: state.ticket.totalAmt + product.price,
            },
          };
        }),

      // Calcular el monto total del ticket
      getTotal: () => {
        return get().ticket.totalAmt;
      },
      addPayment: (paymentMethod, amount) => {
        set((state) => {
          const existingPaymentIndex = state.ticket.payments.findIndex(
            (payment) => payment.name === paymentMethod
          );
          let updatedPayments;
          const change =
            state.ticket.totalPaid + amount > state.ticket.totalAmt
              ? state.ticket.totalPaid + amount - state.ticket.totalAmt
              : 0;
          if (existingPaymentIndex !== -1) {
            updatedPayments = state.ticket.payments.map((payment, index) =>
              index === existingPaymentIndex
                ? {
                    ...payment,
                    amount: payment.amount + amount,
                    change,
                  }
                : payment
            );
          } else {
            // state.ticket.lines.length + 1
            // Si no está, lo agrega con cantidad 1
            updatedPayments = [
              ...state.ticket.payments,
              {
                name: paymentMethod,
                amount,
                change,
                objectId: Utils.uniqueID(),
              },
            ];
          }
          return {
            ticket: {
              ...state.ticket,
              payments: updatedPayments,
              totalPaid:
                change > 0
                  ? state.ticket.totalAmt
                  : state.ticket.totalPaid + amount,
              change: state.ticket.change + change,
            },
          };
        });
      },
      deletePayment: (paymentMethod) => {
        set((state) => {
          const deletedPayment = state.ticket.payments.find(
            (p) => p.name === paymentMethod
          );
          const totalPaid =
            state.ticket.totalPaid -
            (deletedPayment.amount - deletedPayment.change);
          const updatedPayments = state.ticket.payments.filter(
            (p) => p.name !== paymentMethod
          );
          const totalPaymentAmount = updatedPayments.reduce(
            (acc, p) => acc + p.amount,
            0
          );
          return {
            ticket: {
              ...state.ticket,
              payments: updatedPayments,
              totalPaid,
              change:
                totalPaymentAmount > state.ticket.totalAmt
                  ? totalPaymentAmount - state.ticket.totalAmt
                  : 0,
            },
          };
        });
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
            totalPaid: 0,
            change: 0,
            objectId: Utils.uniqueID(),
          }, // Vacía el ticket después de finalizar la venta
        }));
      },
      deleteOrder: () => {
        set(() => ({
          ticket: {
            lines: [],
            payments: [],
            totalAmt: 0,
            totalPaid: 0,
            change: 0,
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
