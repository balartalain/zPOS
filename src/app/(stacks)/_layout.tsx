import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Button, Text, Surface, useTheme, Badge } from 'react-native-paper';
import { ApprovalProvider } from '../../components/approvalContext';
import usePOSStore from '@/src/store/usePOSStore';
import useNetworkStatus from '@/src/hooks/useNetworkStatus';

const StacksLayout = () => {
  const router = useRouter();
  const nav = useNavigation();
  const theme = useTheme();

  const { sales, completeTicket, markSaleAsSynced } = usePOSStore();
  const isConnected = useNetworkStatus();

  // Función para enviar ventas no sincronizadas
  const syncSalesWithServer = async () => {
    try {
      for (const sale of sales.filter((sale) => !sale.synced)) {
        await fetch('https://api.myposapp.com/syncSales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sale),
        });

        markSaleAsSynced(sale.date);
      }
      console.log('Ventas sincronizadas con éxito');
    } catch (error) {
      console.error('Error al sincronizar ventas:', error);
    }
  };

  // Detectar conexión y sincronizar automáticamente
  useEffect(() => {
    if (isConnected && sales.some((sale) => !sale.synced)) {
      //syncSalesWithServer();
    }
  }, [isConnected, sales]);

  return (
    <ApprovalProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: 'Nueva Venta',
            headerLeft: () => {
              return (
                <Ionicons
                  name="menu"
                  size={24}
                  onPress={() => {
                    nav.dispatch(DrawerActions.openDrawer());
                  }}
                  style={{ marginLeft: 8, marginRight: 13 }}
                />
              );
            },
            headerRight: () => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Badge
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: 8,
                      backgroundColor: theme.colors.tertiary,
                    }}
                    size={18}
                    visible={true}
                  >
                    2
                  </Badge>
                  <Ionicons
                    name="cart"
                    size={24}
                    onPress={() => {
                      router.push('/shoppingCart');
                    }}
                    style={{
                      marginLeft: 0,
                      marginRight: 20,
                      color: theme.colors.primary,
                    }}
                  />
                </View>
              );
            },
          }}
        />
        <Stack.Screen
          name="shoppingCart"
          options={{
            headerTitle: 'En la cesta',
          }}
        />
      </Stack>
    </ApprovalProvider>
  );
};

export default StacksLayout;
