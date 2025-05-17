import { FlatList, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, Text, TextInput, Card } from 'react-native-paper';
import AsyncStorageUtils from '../../utils/AsyncStorageUtils';
import SharedView from '@/src/components/shared/sharedView';
import { useData } from '@/src/context/dataContext';
const { width } = Dimensions.get('window');

function CategoryListScreen() {
  const router = useRouter();
  const { isUpdatedMasterData } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [categoriesFilters, setCategoriesFilters] = useState([]);

  useEffect(() => {
    (async () => {
      const categories = await AsyncStorageUtils.findAll('category');
      setCategoriesFilters(categories);
    })();
  }, [isUpdatedMasterData]);
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
      {
        <TextInput
          label="Buscar"
          type="flat"
          value={busqueda}
          onChangeText={filtrarCategories}
          mode="outlined"
          style={styles.input}
        />
      }
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
    height: width * 0.15,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
    minHeight: 60,
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
