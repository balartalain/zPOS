import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import ProductList from '../../components/productList';
import useNetworkStatus from '@/src/hooks/useNetworkStatus';

function TicketScreen() {
  const router = useRouter();
  const theme = useTheme();
  const isConnected = useNetworkStatus();
  const isStoreClosed = false;
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Surface style={styles.surface} elevation={4}>
        <Text variant="displayMedium">Total: $200.00</Text>
      </Surface>
      {isStoreClosed ? <StoreClosed /> : <ProductList />}
      {!isStoreClosed && (
        <Button
          mode="contained"
          style={styles.cobrar}
          onPress={() => console.log('Cobrar')}
        >
          {`COBRAR - ${isConnected}`}
        </Button>
      )}
    </View>
  );
}
function StoreClosed() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons
        name="time"
        size={140}
        onPress={() => {}}
        style={{ color: theme.colors.tertiary }}
      />
      <Button
        mode="contained"
        style={styles.cobrar}
        onPress={() => {
          router.push('/openStore');
        }}
      >
        Abrir la tienda
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
  cobrar: {
    padding: 10,
    marginTop: 10,
  },
});
export default TicketScreen;
