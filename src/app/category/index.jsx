import { FlatList, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Text,
  Surface,
  useTheme,
  TextInput,
  Card,
} from 'react-native-paper';
import AsyncStorageUtils from '../../utils/AsyncStorageUtils';
import SharedView from '@/src/components/shared/sharedView';
import { useData } from '@/src/context/dataContext';
const NoImageIcon = require('@/assets/images/no-image.png');

function CategoryListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const { refreshData } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [categoriesFilters, setCategoriesFilters] = useState([]);

  useEffect(() => {
    (async () => {
      const categories = await AsyncStorageUtils.findAll('category');
      setCategoriesFilters(categories);
    })();
  }, [refreshData]);
  const filtrarCategories = async (texto) => {
    const categories = await AsyncStorageUtils.findAll('category');
    setBusqueda(texto);
    if (texto === '') {
      setCategoriesFilters(categories); // Mostrar todos si el buscador está vacío
    } else {
      setCategoriesFilters(
        categories.filter((category) =>
          categories.name.toLowerCase().includes(texto.toLowerCase())
        )
      );
    }
  };
  return (
    <SharedView>
      {/*<TextInput
        label="Buscar"
        type="flat"
        value={busqueda}
        onChangeText={filtrarCategories}
        mode="outlined"
        style={styles.input}
      />*/}
      <FlatList
        data={categoriesFilters}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            contentStyle={styles.innerCard}
            onPress={() => {
              router.push('/category/edit?id=' + item.id);
            }}
          >
            <Card.Content style={styles.contentCard}>
              <Text variant="titleMedium">{item.name}</Text>
            </Card.Content>
          </Card>
        )}
      />

      {/* Mensaje si no hay productos */}
      {categoriesFilters.length === 0 && (
        <Text style={styles.emptyText}>No se encontraron categorias</Text>
      )}
      <Button
        mode="contained"
        style={styles.addBtn}
        onPress={() => router.push('/category/add')}
      >
        Agregar
      </Button>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  addBtn: {
    padding: 10,
    marginTop: 10,
  },
  input: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
    minHeight: 60,
  },
  productImage: {
    width: 50,
    height: 50,
    //marginRight: 12,
    borderRadius: 4,
    backgroundColor: '#ccc',
    resizeMode: 'cover',
  },
  innerCard: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
  },
  contentCard: {
    paddingLeft: 0,
    paddingBottom: 0,
    marginLeft: 10,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    // color: '#999',
  },
});
export default CategoryListScreen;
