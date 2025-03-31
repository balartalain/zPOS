import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Surface, useTheme } from 'react-native-paper';

import ProductList from '@/src/components/productList';
import SharedView from '@/src/components/shared/sharedView';

function ProductScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Artículos',
    });
  }, [navigation]);
  const theme = useTheme();

  return (
    <SharedView>
      <ProductList />
      <Button
        mode="contained"
        style={styles.cobrar}
        onPress={() => console.log('Cobrar')}
      >
        Agregar
      </Button>
    </SharedView>
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
export default ProductScreen;
