import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Utils } from '@/src/utils';
import { eventBus, eventName } from '../event/eventBus';
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
          const line = {
            ...state.ticket.lines.find((line) => line.id === lineId),
          };
          const diff = qty - line.qty;
          const updatedLines = state.ticket.lines
            .map((line) =>
              line.id === lineId
                ? {
                    ...line,
                    qty,
                    product: {
                      ...line.product,
                      in_stock: parseFloat(line.product.in_stock) - diff,
                    },
                  }
                : line
            )
            .filter((line) => line.qty > 0);

          const newTicket = {
            ticket: {
              ...state.ticket,
              lines: updatedLines,
              total_amount: updatedLines.reduce(
                (acc, line) => acc + line.qty * parseFloat(line.product.price),
                0
              ),
            },
          };
          const { product } = line;
          eventBus.emit(eventName.UPDATE_PRODUCT, {
            ...product,
            in_stock: parseFloat(product.in_stock) - diff,
          });
          return newTicket;
        });
      },
      addProductToTicket: (product) => {
        set((state) => {
          const existingProductIndex = state.ticket.lines.findIndex(
            (line) => line.product.id === product.id
          );

          let updatedLines;
          if (existingProductIndex !== -1) {
            // Si el producto ya está, incrementa su cantidad
            updatedLines = state.ticket.lines.map((line, index) =>
              index === existingProductIndex
                ? {
                    ...line,
                    product: {
                      ...product,
                      in_stock: parseFloat(product.in_stock) - 1,
                    },
                    qty: (line.qty || 1) + 1,
                  }
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
                product: {
                  ...product,
                  in_stock: parseFloat(product.in_stock) - 1,
                },
                qty: 1,
              },
            ];
          }
          eventBus.emit(eventName.UPDATE_PRODUCT, {
            ...product,
            in_stock: parseFloat(product.in_stock) - 1,
          });
          return {
            ticket: {
              ...state.ticket,
              lines: updatedLines,
              total_amount:
                state.ticket.total_amount + parseFloat(product.price),
            },
          };
        });
      },
      // Calcular el monto total del ticket
      getTotalAmt: () => {
        return get().ticket.total_amount;
      },
      getTotalPaid: () => {
        const total_payments = get().ticket.payments.reduce(
          (acc, p) => acc + p.amount,
          0
        );
        return total_payments - get().ticket.change;
      },
      addPayment: (paymentMethod, amount) => {
        set((state) => {
          const existingPaymentIndex = state.ticket.payments.findIndex(
            (payment) => payment.payment_method === paymentMethod
          );
          let updatedPayments;
          if (existingPaymentIndex !== -1) {
            updatedPayments = state.ticket.payments.map((payment, index) =>
              index === existingPaymentIndex
                ? {
                    ...payment,
                    amount: payment.amount + amount,
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
              },
            ];
          }
          const total_payments = get().ticket.payments.reduce(
            (acc, p) => acc + p.amount,
            0
          );
          const change =
            total_payments + amount > state.ticket.total_amount
              ? total_payments + amount - state.ticket.total_amount
              : 0;

          return {
            ticket: {
              ...state.ticket,
              payments: updatedPayments,
              change,
            },
          };
        });
      },
      deletePayment: (paymentMethod) => {
        set((state) => {
          const updatedPayments = state.ticket.payments.filter(
            (p) => p.payment_method !== paymentMethod
          );
          const totalPaid = updatedPayments.reduce(
            (acc, p) => acc + p.amount,
            0
          );
          return {
            ticket: {
              ...state.ticket,
              payments: updatedPayments,
              change:
                totalPaid > state.ticket.total_amount
                  ? totalPaid - state.ticket.total_amount
                  : 0,
            },
          };
        });
      },
      // Guardar venta en el historial (con fecha y sincronización pendiente)
      completeTicket: () => {
        const newSale = {
          ...get().ticket,
          created_at: new Date(),
        };
        if (get().ticket.change > 0) {
          newSale.payments.push({
            id: Utils.uniqueID(),
            order_id: get().ticket.id,
            payment_method: 'Efectivo',
            amount: -get().ticket.change,
          });
        }
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
        eventBus.emit(eventName.SYNC_ORDER, newSale);
      },
      deleteOrder: () => {
        const cloneTicket = { ...get().ticket };
        set(() => ({
          ticket: {
            id: Utils.uniqueID(),
            lines: [],
            payments: [],
            total_amount: 0,
            change: 0,
          }, // Vacía el ticket después de finalizar la venta
        }));
        const products = cloneTicket.lines.map((line) => ({
          ...line.product,
          in_stock: parseFloat(line.product.in_stock) + line.qty,
        }));
        eventBus.emit(eventName.UPDATE_PRODUCT, products);
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
