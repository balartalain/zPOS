import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, TextInput, Text, Button } from 'react-native-paper';

// Lista de productos
const _productos = [
  { id: '1', qty: 1, nombre: 'Cerveza', precio: 25 },
  { id: '2', qty: 3, nombre: 'Coca Cola', precio: 20},
  { id: '3', qty: 2, nombre: 'Agua Mineral', precio: 15 },
  { id: '4', qty: 5, nombre: 'Hamburguesa', precio: 50},  
];

export default function ShoppingCartScreen() {
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto del buscador
  const [productos] = useState(_productos);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Lista de productos */}
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>                      
            <Card.Content style={styles.contentCard}>
              <Text variant="titleMedium">{item.nombre} x {item.qty}</Text>
              <Text variant="titleMedium">${item.precio*item.qty}</Text>                         
            </Card.Content>
          </Card>
        )}
      />
      <Button mode="contained"
        style={styles.cobrar} onPress={() => console.log("Cobrar")}>
        COBRAR
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  contentCard:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cobrar:{
    padding:10,
    marginTop: 10
  }
});
