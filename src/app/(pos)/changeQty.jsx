import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { TextInput, Divider, useTheme, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import Toast from 'react-native-toast-message';
import useTicketStore from '@/src/store/useTicketStore';
import SharedView from '../../components/shared/sharedView';
import AsyncStorageUtils from '@/src/utils/AsyncStorageUtils';
import { useData } from '@/src/context/dataContext';

const { width } = Dimensions.get('window');
const getProduct = async (productId) => {
  const product = await AsyncStorageUtils.findById('product', productId);
  return product;
};
function ChangeQtyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { lineId } = useLocalSearchParams();
  const { ticket, setQty } = useTicketStore();
  const [product, setProduct] = useState();
  const line = ticket.lines.find((l) => l.id === lineId);
  const [qty, _setQty] = useState(line ? line.qty : 0);
  useEffect(() => {
    (async () => {
      if (isFocused) {
        const _product = await getProduct(line.product.id);
        setProduct(_product);
      }
    })();
  }, [isFocused, line, line?.product.id, line?.qty]);
  console.log(product);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: product?.name,
    });
  }, [navigation, lineId, product?.name]);

  const increment = async () => {
    setProduct((product) => ({
      ...product,
      in_stock: product.in_stock - 1,
    }));
    _setQty((value) => Number(value) + 1);
  };
  const decrement = () => {
    setProduct((product) => ({
      ...product,
      in_stock: product.in_stock + 1,
    }));
    _setQty((value) => Number(value) - 1);
  };
  const handleSetQty = (_value) => {
    const value = _value === '' ? 0 : Number(_value);
    if (product.in_stock + qty - value < 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No hay stock suficiente',
        position: 'bottom',
      });
    } else {
      setProduct((product) => ({
        ...product,
        in_stock: product.in_stock + qty - value,
      }));
      _setQty(value);
    }
  };
  const handlePressDone = async () => {
    router.back();
    setQty(line.id, qty);
  };
  return (
    <SharedView style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: theme.colors.primary,
              opacity: qty === 0 ? 0.4 : 1,
            },
          ]}
          onPress={decrement}
          disabled={qty === 0}
        >
          <Text style={styles.labelBtn}>-</Text>
        </TouchableOpacity>
        <TextInput
          autoFocus={true}
          style={styles.field}
          label="Cantidad"
          keyboardType="numeric"
          value={String(qty)}
          onChangeText={handleSetQty}
        />
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: theme.colors.primary,
              opacity: product?.in_stock === 0 ? 0.4 : 1,
            },
          ]}
          onPress={increment}
          disabled={product?.in_stock === 0}
        >
          <Text style={styles.labelBtn}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}></View>
      <Button mode="contained" style={styles.doneBtn} onPress={handlePressDone}>
        Aceptar
      </Button>
    </SharedView>
  );
}
export default ChangeQtyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  btn: {
    width: '15%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  labelBtn: {
    fontSize: 18,
  },
  field: {
    flex: 1,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  doneBtn: {
    height: width * 0.15,
    justifyContent: 'center',
    //borderRadius: 2,
  },
});
