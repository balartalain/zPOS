import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import ProductList from '../../components/productList';
import useNetworkStatus from '@/src/hooks/useNetworkStatus';
import useTicketStore from '@/src/store/useTicketStore';
import { checkStoredState } from '@/src/utils/checkAsyncStorage';

function TicketScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { ticket, addProductToTicket, getTotal } = useTicketStore();
  //const isConnected = useNetworkStatus();
  const isStoreClosed = false;

  const addProduct = (product: any) => {
    addProductToTicket(product);
    //console.log(ticket.lines);
  };
  const payTicket = () => {
    router.push('/addPayment');
  };
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Surface
        style={[styles.surface, { backgroundColor: theme.colors.primary }]}
        elevation={5}
      >
        <Text variant="displayMedium">{`Total: $${getTotal()}`}</Text>
      </Surface>
      {isStoreClosed ? <StoreClosed /> : <ProductList onPress={addProduct} />}
      {!isStoreClosed && (
        <Button mode="contained" style={styles.pay} onPress={payTicket}>
          Pagar
        </Button>
      )}
    </View>
  );
}
function StoreClosed() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons
        name="time"
        size={140}
        onPress={() => {}}
        style={{ color: theme.colors.tertiary }}
      />
      <Button
        mode="contained"
        style={styles.pay}
        onPress={() => {
          router.push('/openStore');
        }}
      >
        Abrir la tienda
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  surface: {
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pay: {
    padding: 10,
    marginTop: 10,
  },
});
export default TicketScreen;
