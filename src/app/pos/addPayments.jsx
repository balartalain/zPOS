import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Surface } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import useTicketStore from '@/src/store/useTicketStore';
import KeypadPayment from '../../components/keyPadPayment';
import { Utils } from '@/src/utils';
import { useHeader } from '@/src/context/headerContext';
import SharedText from '@/src/components/shared/sharedText';

const { width } = Dimensions.get('window');

export default function PaymentScreen() {
  const isFocused = useIsFocused();
  const { ticket, deletePayment, getTotalPaid } = useTicketStore();
  const { setHeaderActions, setHeaderContent } = useHeader();

  const pending = parseFloat(ticket.total_amount) - parseFloat(getTotalPaid());
  const label =
    ticket.change === 0
      ? `Por pagar ${Utils.formatCurrency(pending)}`
      : `Cambio ${Utils.formatCurrency(ticket.change)}`;

  const headerContent = React.useMemo(
    () => (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <SharedText h5 title="Efectuar el pago" />
        <SharedText
          h6
          title={`${label}`}
          style={{
            color: ticket.change >= 0 && pending === 0 ? 'green' : 'red',
          }}
        />
      </View>
    ),
    [label, pending, ticket.change]
  );

  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent(headerContent);
      setHeaderActions(null);
    }
  }, [isFocused, setHeaderContent, headerContent, setHeaderActions]);

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
                width: '55%',
                paddingLeft: 8,
                paddingVertical: 8,
                borderBottomWidth: 0.5,
              }}
            >
              <SharedText h6 style={{ flex: 1 }} title={p.payment_method} />
              <SharedText
                h6
                style={{ marginRight: 8 }}
                title={Utils.formatCurrency(p.amount)}
              />
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
