import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Surface } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import useTicketStore from '@/src/store/useTicketStore';
import KeypadPayment from '../../components/keyPadPayment';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const { ticket, deletePayment } = useTicketStore();
  'Por pagar: ' + (parseFloat(ticket.totalAmt) - parseFloat(ticket.totalPaid)),
    useEffect(() => {
      navigation.setOptions({
        //headerTitleAlign: 'left',
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            size={24}
            style={{ marginLeft: 0, marginRight: 10 }}
            onPress={() => navigation.goBack()}
          />
        ),
        headerStyle: {
          //backgroundColor: '#f4511e',
          //textAlign: 'left',
        },
        //headerTitleStyle: { fontWei },
        headerTitle: () => {
          const pending =
            parseFloat(ticket.totalAmt) - parseFloat(ticket.totalPaid);
          const label =
            ticket.change === 0
              ? `Por pagar ${pending}`
              : `Cambio ${ticket.change}`;
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <Text
                style={{ color: 'green', fontSize: 20 }}
              >{` Total ${ticket.totalAmt} Cup`}</Text>
              <Text
                style={{
                  fontSize: 20,
                  color: ticket.change >= 0 && pending === 0 ? 'green' : 'red',
                }}
              >{` ${label} Cup`}</Text>
            </View>
          );
        },
      });
    }, [navigation, ticket.totalAmt, ticket.totalPaid, ticket.change]);

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
          {ticket.payments.map((p) => (
            <View
              key={p.name}
              style={{
                flexDirection: 'row',
                width: '50%',
                paddingLeft: 8,
                paddingVertical: 8,
                borderBottomWidth: 0.5,
              }}
            >
              <Text style={{ flex: 1 }}>{p.name}</Text>
              <Text style={{ marginRight: 8 }}>{p.amount}</Text>
              <TouchableOpacity onPress={() => handleDeletePayment(p.name)}>
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
