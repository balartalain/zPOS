import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import ProductList from '../../components/productList';
import useNetworkStatus from '@/src/hooks/useNetworkStatus';
import useTicketStore from '@/src/store/useTicketStore';
import { checkStoredState } from '@/src/utils/checkAsyncStorage';
import { Utils } from '@/src/utils';
import AsyncStorageUtils from '@/src/utils/AsyncStorageUtils';
import { useData } from '@/src/context/dataContext';
const { width } = Dimensions.get('window');

function TicketScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { forceRefresh } = useData();
  const { ticket, deleteOrder, addProductToTicket, getTotalAmt } =
    useTicketStore();
  const isStoreClosed = false;

  const addProduct = React.useCallback(async (product: any) => {
    product.in_stock = product.in_stock - 1;
    await addProductToTicket(product);
    await AsyncStorageUtils.update('product', product);
    //console.log(ticket.lines);
  }, []);

  const payTicket = () => {
    router.push('/addPayments');
  };
  const handleDeleteOrder = async () => {
    for (const line of ticket.lines) {
      const product = {
        ...line.product,
        in_stock: line.product.in_stock + line.qty,
      };
      await AsyncStorageUtils.update('product', product);
    }
    forceRefresh();
    deleteOrder();
  };
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Surface style={styles.display} elevation={2}>
        <Text variant="displayMedium">{`Total: ${Utils.formatCurrency(getTotalAmt())}`}</Text>
      </Surface>
      {isStoreClosed ? <StoreClosed /> : <ProductList onPress={addProduct} />}
      {!isStoreClosed && (
        <View
          style={{
            marginTop: 5,
            height: width * 0.15,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Button
            mode="contained"
            style={styles.payBtn}
            onPress={handleDeleteOrder}
          >
            Limpiar Cesta
          </Button>
          <Button mode="contained" style={styles.payBtn} onPress={payTicket}>
            Pagar
          </Button>
        </View>
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
        style={styles.payBtn}
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
  display: {
    paddingVertical: 20,
    paddingLeft: 10,
    marginBottom: 10,
    //width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    //backgroundColor: '#FFFFFF',
  },
  payBtn: {
    width: '49%',
    borderRadius: 0,
    justifyContent: 'center',
    //height: width * 0.2,
  },
});
export default React.memo(TicketScreen);
