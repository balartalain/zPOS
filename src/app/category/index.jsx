import { FlatList, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Button, Text, TextInput, Card } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import { useData } from '@/src/context/dataContext';
import { eventBus, eventName } from '@/src/event/eventBus';
import { useHeader } from '@/src/context/headerContext';
import useWhyDidYouUpdate from '@/src/hooks/useWhyDidYouUpdate';
const { width } = Dimensions.get('window');

function CategoryListScreen() {
  const router = useRouter();
  const { setHeaderContent, setHeaderActions } = useHeader();
  const isFocused = useIsFocused();
  const { loadCategories } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [categoriesFilters, setCategoriesFilters] = useState([]);
  useWhyDidYouUpdate(
    'CategoryListScreen',
    {},
    {
      loadCategories,
      busqueda,
      categoriesFilters,
    }
  );
  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent('Categorías');
      setHeaderActions(null);
    }
  }, [setHeaderContent, setHeaderActions, isFocused]);
  useEffect(() => {
    //console.log('Category List mount');
    loadCategories().then((categories) => {
      setCategoriesFilters(categories);
    });
    eventBus.on(eventName.CHANGED_CATEGORY, async () => {
      //console.log('Category Screen=>CHANGED_CATEGORY event');
      setCategoriesFilters(await loadCategories());
    });
  }, [loadCategories]);

  const filtrarCategories = async (texto) => {
    const categories = await loadCategories();
    setBusqueda(texto);
    if (texto === '') {
      setCategoriesFilters(categories); // Mostrar todos si el buscador está vacío
    } else {
      setCategoriesFilters(
        categories.filter((category) =>
          category.name.toLowerCase().includes(texto.toLowerCase())
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
