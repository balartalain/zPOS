import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { Card, TextInput, Text, Button } from 'react-native-paper';
import useTicketStore from '@/src/store/useTicketStore';

export default function ShoppingCartScreen() {
  const router = useRouter();
  const { ticket } = useTicketStore();

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Lista de productos */}
      <FlatList
        data={ticket.lines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => {
              router.push(
                `/changeQty?productName=${item.product.name}&price=${item.product.price}`
              );
            }}
          >
            <Card.Content style={styles.contentCard}>
              <Text variant="titleMedium">
                {item.product.name} x {item.qty}
              </Text>
              <Text variant="titleMedium">
                ${item.product.price * item.qty}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
      <Button
        mode="contained"
        style={styles.cobrar}
        onPress={() => console.log('Cobrar')}
      >
        COBRAR
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  contentCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cobrar: {
    padding: 10,
    marginTop: 10,
  },
});
