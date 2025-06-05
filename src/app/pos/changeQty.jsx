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
import { useHeader } from '@/src/context/headerContext';
import SharedButton from '../../components/shared/sharedButton';
import SharedText from '../../components/shared/sharedText';

const { width } = Dimensions.get('window');
const getProduct = async (productId) => {
  const product = await AsyncStorageUtils.findById('product', productId);
  return product;
};
function ChangeQtyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { lineId } = useLocalSearchParams();
  const { ticket, setQty } = useTicketStore();
  const [product, setProduct] = useState();
  const { setHeaderActions, setHeaderContent } = useHeader();
  const line = ticket.lines.find((l) => l.id === lineId);
  const [qty, _setQty] = useState(line ? line.qty : 0);

  const headerContent = React.useMemo(
    () => (
      <View>
        <SharedText h6 title={product?.name} />
        <SharedText
          p
          title={`stock: ${product?.in_stock ?? ''}`}
          style={[product?.in_stock === 0 ? styles.outOfStock : styles.inStock]}
        />
      </View>
    ),
    [product?.in_stock, product?.name]
  );
  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent(headerContent);
      setHeaderActions(null);
    }
  }, [isFocused, setHeaderContent, headerContent, setHeaderActions]);

  useEffect(() => {
    (async () => {
      if (isFocused) {
        const _product = await getProduct(line.product.id);
        setProduct(_product);
      }
    })();
  }, [isFocused, line, line?.product.id, line?.qty]);

  const increment = async () => {
    setProduct((product) => ({
      ...product,
      in_stock: parseFloat(product.in_stock) - 1,
    }));
    _setQty((value) => Number(value) + 1);
  };
  const decrement = () => {
    setProduct((product) => ({
      ...product,
      in_stock: parseFloat(product.in_stock) + 1,
    }));
    _setQty((value) => Number(value) - 1);
  };
  const handleSetQty = (_value) => {
    const value = _value === '' ? 0 : Number(_value);
    if (parseFloat(product.in_stock) + qty - value < 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No hay stock suficiente',
        position: 'bottom',
      });
    } else {
      setProduct((product) => ({
        ...product,
        in_stock: parseFloat(product.in_stock) + qty - value,
      }));
      _setQty(value);
    }
  };
  const handlePressDone = async () => {
    router.back();
    setQty(line.id, qty);
  };
  return (
    <SharedView>
      <View style={{ flexDirection: 'row' }}>
        <SharedButton
          style={[
            styles.btn,
            {
              backgroundColor: theme.colors.primary,
              opacity: qty === 0 ? 0.4 : 1,
            },
          ]}
          label="-"
          onPress={decrement}
          disabled={qty === 0}
        />
        <TextInput
          autoFocus={true}
          style={styles.field}
          label="Cantidad"
          keyboardType="numeric"
          value={String(qty)}
          onChangeText={handleSetQty}
        />
        <SharedButton
          style={[
            styles.btn,
            {
              backgroundColor: theme.colors.primary,
              opacity: product?.in_stock === 0 ? 0.4 : 1,
            },
          ]}
          label="+"
          onPress={increment}
          disabled={product?.in_stock === 0}
        />
      </View>
      <View style={{ flex: 1 }}></View>
      <SharedButton label="Aceptar" onPress={handlePressDone} />
    </SharedView>
  );
}
export default ChangeQtyScreen;

const styles = StyleSheet.create({
  btn: {
    width: '16%',
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
    marginHorizontal: 2,
    textAlign: 'center',
    height: 'auto',
  },
  outOfStock: {
    color: 'red',
    textDecorationLine: 'line-through',
  },
  inStock: {
    color: 'green',
    textDecorationLine: 'none',
  },
});
