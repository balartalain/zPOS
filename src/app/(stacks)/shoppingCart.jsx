import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import {
  Card,
  TextInput,
  Text,
  Button,
  Surface,
  useTheme,
} from 'react-native-paper';
import useTicketStore from '@/src/store/useTicketStore';

export default function ShoppingCartScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { ticket, getTotal } = useTicketStore();

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Surface
        style={[styles.surface, { backgroundColor: theme.colors.primary }]}
        elevation={5}
      >
        <Text variant="displayMedium">{`Total: $${getTotal()}`}</Text>
      </Surface>
      <FlatList
        data={ticket.lines}
        keyExtractor={(item, index) => index}
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
  surface: {
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
