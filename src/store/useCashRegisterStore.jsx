import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCashRegisterStore = create(
  persist(
    (set, get) => ({
      cashRegister: {
        balance: 0, // Dinero actual en caja
        transactions: [], // Historial de ingresos y retiros
      },

      // 🏪 Inicializar fondo de caja al abrir la tienda
      setInitialFund: (amount) =>
        set((state) => ({
          cashRegister: {
            balance: amount,
            transactions: [
              ...state.cashRegister.transactions,
              { type: 'entrada', amount },
            ],
          },
        })),

      // 💰 Registrar una entrada de dinero
      addCash: (amount) =>
        set((state) => ({
          cashRegister: {
            balance: state.cashRegister.balance + amount,
            transactions: [
              ...state.cashRegister.transactions,
              { type: 'entrada', amount },
            ],
          },
        })),

      // 🏧 Retirar dinero de la caja
      removeCash: (amount) =>
        set((state) => {
          if (state.cashRegister.balance < amount) {
            console.warn('❌ No hay suficiente saldo en caja.');
            return state;
          }
          return {
            cashRegister: {
              balance: state.cashRegister.balance - amount,
              transactions: [
                ...state.cashRegister.transactions,
                { type: 'salida', amount },
              ],
            },
          };
        }),

      // 🔄 Obtener el historial de transacciones
      getTransactions: () => get().cashRegister.transactions,

      // 💰 Obtener el saldo actual
      getBalance: () => get().cashRegister.balance,
    }),
    {
      name: 'cash-register-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCashRegisterStore;
