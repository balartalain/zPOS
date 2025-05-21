import { useState, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSyncOrders() {
  const [isSyncing, setIsSyncing] = useState(false);
  const syncInProgress = useRef(false); // Variable para evitar concurrencia

  const syncOrders = async () => {
    if (syncInProgress.current) {
      //console.log('🚀 Sincronización ya en progreso, evitando duplicados...');
      return;
    }

    try {
      syncInProgress.current = true; // Marcar como en proceso
      setIsSyncing(true);

      const storedOrders = await AsyncStorage.getItem('pendingOrders');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];

      if (orders.length > 0) {
        //console.log('🔄 Sincronizando pedidos...', orders);

        // Simulación de envío al servidor
        await fetch('https://api.example.com/orders', {
          method: 'POST',
          body: JSON.stringify(orders),
        });

        //console.log('✅ Sincronización completa, limpiando almacenamiento...');
        await AsyncStorage.removeItem('pendingOrders'); // Limpiar órdenes sincronizadas
      }
    } catch (error) {
      console.error('❌ Error en la sincronización:', error);
    } finally {
      syncInProgress.current = false; // Restablecer estado
      setIsSyncing(false);
    }
  };

  // Disparar sincronización cuando se restablezca la conexión
  NetInfo.addEventListener((state) => {
    if (state.isConnected && !syncInProgress.current) {
      syncOrders();
    }
  });

  return { syncOrders, isSyncing };
}
