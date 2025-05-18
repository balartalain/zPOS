import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Utils } from '@/src/utils';
const useTicketStore = create(
  persist(
    (set, get) => ({
      ticket: {
        id: Utils.uniqueID(),
        lines: [],
        payments: [],
        total_amount: 0,
        change: 0,
      }, // Ticket con líneas de productos
      sales: [], // Ventas almacenadas de los últimos 30 días
      isClosedStore: true,
      openShift: (initialCash) => {},
      setQty: (lineId, qty) => {
        set((state) => {
          const updatedLines = state.ticket.lines.map((line) =>
            line.id === lineId ? { ...line, qty } : line
          );
          return {
            ticket: {
              ...state.ticket,
              lines: updatedLines,
              total_amount: updatedLines.reduce(
                (acc, line) => acc + line.qty * line.product.price,
                0
              ),
            },
          };
        });
      },
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
            // state.ticket.lines.length + 1
            // Si no está, lo agrega con cantidad 1
            updatedLines = [
              ...state.ticket.lines,
              {
                id: Utils.uniqueID(),
                order_id: get().ticket.id,
                product,
                qty: 1,
              },
            ];
          }

          return {
            ticket: {
              ...state.ticket,
              lines: updatedLines,
              total_amount: state.ticket.total_amount + product.price,
            },
          };
        }),

      // Calcular el monto total del ticket
      getTotalAmt: () => {
        return get().ticket.total_amount;
      },
      getTotalPaid: () => {
        return get().ticket.change > 0
          ? get().ticket.total_amount
          : get().ticket.payments.reduce((acc, p) => acc + p.amount, 0);
      },
      addPayment: (paymentMethod, amount) => {
        set((state) => {
          const existingPaymentIndex = state.ticket.payments.findIndex(
            (payment) => payment.payment_method === paymentMethod
          );
          let updatedPayments;
          const change =
            state.getTotalPaid() + amount > state.ticket.total_amount
              ? state.getTotalPaid() + amount - state.ticket.total_amount
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
                id: Utils.uniqueID(),
                order_id: get().ticket.id,
                payment_method: paymentMethod,
                amount,
                change,
              },
            ];
          }
          return {
            ticket: {
              ...state.ticket,
              payments: updatedPayments,
              change: state.ticket.change + change,
            },
          };
        });
      },
      deletePayment: (paymentMethod) => {
        set((state) => {
          const updatedPayments = state.ticket.payments.filter(
            (p) => p.payment_method !== paymentMethod
          );
          const totalPaymentAmount = updatedPayments.reduce(
            (acc, p) => acc + p.amount,
            0
          );
          return {
            ticket: {
              ...state.ticket,
              payments: updatedPayments,
              change:
                totalPaymentAmount > state.ticket.total_amount
                  ? totalPaymentAmount - state.ticket.total_amount
                  : 0,
            },
          };
        });
      },
      // Guardar venta en el historial (con fecha y sincronización pendiente)
      completeTicket: (created_at) => {
        const newSale = {
          ...get().ticket,
          created_at,
        };
        set((state) => ({
          sales: [...state.sales, newSale], // Se guarda en la lista de ventas
          ticket: {
            id: Utils.uniqueID(),
            lines: [],
            payments: [],
            total_amount: 0,
            change: 0,
          }, // Vacía el ticket después de finalizar la venta
        }));
      },
      deleteOrder: () => {
        set(() => ({
          ticket: {
            id: Utils.uniqueID(),
            lines: [],
            payments: [],
            total_amount: 0,
            change: 0,
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
