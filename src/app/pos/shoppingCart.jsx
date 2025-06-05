import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import {
  Card,
  TextInput,
  Text,
  Button,
  Surface,
  useTheme,
} from 'react-native-paper';
import SharedText from '@/src/components/shared/sharedText';
import SharedButton from '../../components/shared/sharedButton';
import useTicketStore from '@/src/store/useTicketStore';
import { Utils } from '@/src/utils';
import { useHeader } from '@/src/context/headerContext';

const { width } = Dimensions.get('window');

export default function ShoppingCartScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { ticket, deleteOrder, getTotalAmt } = useTicketStore();
  const { setHeaderContent, setHeaderActions } = useHeader();

  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent('En la cesta');
      setHeaderActions(null);
    }
  }, [setHeaderContent, setHeaderActions, isFocused]);

  const handleDeleteOrder = () => {
    deleteOrder();
    router.back();
  };
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Surface style={styles.display} elevation={2}>
        <SharedText
          h2
          title={`Total: ${Utils.formatCurrency(getTotalAmt())}`}
        />
      </Surface>
      <FlatList
        data={ticket.lines}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => {
              router.push(
                `/pos/changeQty?lineId=${item.id}&price=${item.product.price}`
              );
            }}
          >
            <Card.Content style={styles.contentCard}>
              <SharedText title={`${item.product.name} x ${item.qty}`} />
              <SharedText
                title={Utils.formatCurrency(item.product.price * item.qty)}
              />
            </Card.Content>
          </Card>
        )}
      />
      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <SharedButton
          style={styles.btn}
          onPress={handleDeleteOrder}
          label="Limpiar Cesta"
        />
        <SharedButton
          style={styles.btn}
          label="Pagar"
          onPress={() => router.push('/pos/addPayments')}
        />
      </View>
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
    backgroundColor: '#FFFFFF',
  },
  card: {
    marginBottom: 10,
  },
  contentCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: '49%',
    justifyContent: 'center',
  },
});
