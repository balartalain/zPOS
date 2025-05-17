import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Surface } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import useTicketStore from '@/src/store/useTicketStore';
import KeypadPayment from '../../components/keyPadPayment';
import { Utils } from '@/src/utils';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const { ticket, deletePayment, getTotalPaid } = useTicketStore();

  useEffect(() => {
    navigation.setOptions({
      //headerTitleAlign: 'left',
      // headerLeft: () => (
      //   <Ionicons
      //     name="arrow-back"
      //     size={24}
      //     style={{ marginLeft: 0, marginRight: 10 }}
      //     onPress={() => navigation.goBack()}
      //   />
      // ),
      headerStyle: {
        //backgroundColor: '#f4511e',
        //textAlign: 'left',
      },
      //headerTitleStyle: { fontSize: 6 },
      headerTitle: () => {
        const pending =
          parseFloat(ticket.total_amount) - parseFloat(getTotalPaid());
        const label =
          ticket.change === 0
            ? `Por pagar ${Utils.formatCurrency(pending)}`
            : `Cambio ${Utils.formatCurrency(ticket.change)}`;
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Text
              style={{ color: 'green', fontSize: 16 }}
            >{` Total ${Utils.formatCurrency(ticket.total_amount)}`}</Text>
            <Text
              style={{
                fontSize: 16,
                color: ticket.change >= 0 && pending === 0 ? 'green' : 'red',
              }}
            >{` ${label}`}</Text>
          </View>
        );
      },
    });
  }, [navigation, ticket.total_amount, getTotalPaid, ticket.change]);

  const handleDeletePayment = (pm) => {
    deletePayment(pm);
  };
  return (
    <SharedView>
      <View style={styles.paymentView}>
        <Surface
          style={{
            flex: 1,
            marginBottom: 10,
            backgroundColor: '#FFFFFF',
          }}
          elevation={2}
        >
          {ticket.payments.map((p, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                width: '50%',
                paddingLeft: 8,
                paddingVertical: 8,
                borderBottomWidth: 0.5,
              }}
            >
              <Text style={{ flex: 1 }}>{p.payment_method}</Text>
              <Text style={{ marginRight: 8 }}>
                {Utils.formatCurrency(p.amount)}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeletePayment(p.payment_method)}
              >
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </Surface>
      </View>
      <View style={styles.bottom}>
        <KeypadPayment />
      </View>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  paymentView: {
    flex: 1,
  },
  bottom: {
    //flex: 0.8,
    flexDirection: 'row',
    alignItems: 'flex-end',
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
});
