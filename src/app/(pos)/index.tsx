import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Surface, useTheme, Badge } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProductList from '../../components/productList';
import useNetworkStatus from '@/src/hooks/useNetworkStatus';
import useTicketStore from '@/src/store/useTicketStore';
import { checkStoredState } from '@/src/utils/checkAsyncStorage';
import { Utils } from '@/src/utils';
import AsyncStorageUtils from '@/src/utils/AsyncStorageUtils';
import { useData } from '@/src/context/dataContext';
import SynchronizeIcon from '@/src/components/synchronizeIcon';
const { width } = Dimensions.get('window');

function Basket({ onSetBasketCoords }) {
  const router = useRouter();
  const theme = useTheme();
  const { ticket } = useTicketStore();
  const basketRef = React.useRef(null);
  const itemCount = ticket.lines.reduce((acc, line) => acc + line.qty, 0);
  React.useEffect(() => {
    setTimeout(() => {
      if (basketRef.current) {
        basketRef.current.measureInWindow((x, y, width, height) => {
          onSetBasketCoords({ x: x - 20 + width / 2, y, width, height });
          //console.log(x, y, width, height);
          ////console.log(insets);
        });
      }
    }, 500);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      //router.replace('/');
    }, [])
  );
  return (
    <View
      ref={basketRef}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push('/shoppingCart');
        }}
      >
        <Badge
          style={{
            position: 'absolute',
            top: -6,
            right: -3,
            backgroundColor: theme.colors.tertiary,
            zIndex: 1,
          }}
          size={18}
          visible={true}
        >
          {itemCount}
        </Badge>

        <Ionicons
          name="cart"
          size={30}
          style={{
            marginLeft: 0,
            //marginRight: 20,
            color: theme.colors.primary,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
function TicketScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const [basketCoords, setBasketCoords] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const { ticket, deleteOrder, addProductToTicket, getTotalAmt } =
    useTicketStore();
  const isStoreClosed = false;
  //console.log('pos screen');

  useLayoutEffect(() => {
    navigation.setOptions({
      //headerTitleAlign: 'left',
      headerRight: () => <Basket onSetBasketCoords={setBasketCoords} />,
    });
  }, [navigation]);
  const addProduct = React.useCallback(async (product: any) => {
    await addProductToTicket(product);
    ////console.log(ticket.lines);
  }, []);

  const payTicket = () => {
    router.push('/addPayments');
  };
  const handleDeleteOrder = async () => {
    deleteOrder();
  };
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Surface style={styles.display} elevation={2}>
        <Text variant="displayMedium">{`Total: ${Utils.formatCurrency(getTotalAmt())}`}</Text>
      </Surface>
      {isStoreClosed ? (
        <StoreClosed />
      ) : (
        <ProductList onPress={addProduct} basketCoords={basketCoords} />
      )}
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
    //borderRadius: 2,
    justifyContent: 'center',
    //height: width * 0.2,
  },
});
export default React.memo(TicketScreen);
