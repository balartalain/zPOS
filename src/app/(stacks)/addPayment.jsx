import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, TextInput } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import useTicketStore from '@/src/store/useTicketStore';
import KeypadPayment from '../../components/keyPadPayment';
export default function PaymentScreen() {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const { ticket, addProductToTicket, getTotal } = useTicketStore();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Total a pagar: ' + getTotal(),
    });
  }, [navigation]);

  const handleChangeText = (text) => {
    setInputValue(text);
    console.log('Current value:', text);
    // Perform validation or formatting here
  };
  return (
    <SharedView>
      <View style={styles.paymentView}></View>
      <View style={styles.bottom}>
        <KeypadPayment />
      </View>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  paymentView: {
    flex: 0.3,
  },
  bottom: {
    flex: 0.7,
    flexDirection: 'row',
  },
  paymentButton: {
    //flex: 1,
    borderRadius: 2,
    //width: '100%',
    marginBottom: 8,
    height: 60,
    justifyContent: 'center',
  },
  keypadContainer: {
    //flex: 1,
    width: '70%',
  },
  amountInput: {
    //marginTop: 10,
    marginBottom: 10,
    width: '100%',
    marginTop: 0,
    //borderTopRightRadius: 2,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 1,
  },
  keypadButton: {
    //flex: 1,
    //marginHorizontal: 5,
    height: 60,
    justifyContent: 'center',
    marginRight: 1,
    borderRadius: 2,
  },
  doneButton: {
    flex: 1,
    //marginHorizontal: 5,
    height: 60,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    borderRadius: 2,
  },
});
