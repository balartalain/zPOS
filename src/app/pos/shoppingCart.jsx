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
      <Surface style={styles.surface} elevation={2}>
        <Text
          style={{ fontSize: width * 0.1 }}
        >{`Total: ${Utils.formatCurrency(getTotalAmt())}`}</Text>
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
              <Text variant="titleMedium">
                {item.product.name} x {item.qty}
              </Text>
              <Text variant="titleMedium">
                {Utils.formatCurrency(item.product.price * item.qty)}
              </Text>
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
        <Button mode="contained" style={styles.btn} onPress={handleDeleteOrder}>
          Limpiar Cesta
        </Button>
        <Button
          mode="contained"
          style={styles.btn}
          onPress={() => router.push('/pos/addPayments')}
        >
          Pagar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
    width: '100%',
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
    height: width * 0.15,
    justifyContent: 'center',
  },
});
