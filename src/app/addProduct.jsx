import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Menu, Divider, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import SharedView from '@/src/components/shared/sharedView';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import ModalDropdown from '../components/modalDropdown';
import CategoryModel from '../model/categoryModel';
import ProductModel from '../model/productModel';
import Utils from '../utils/utils';

const newProduct = () => {
  return {
    objectId: Utils.uniqueID(),
    id: Utils.uniqueID(), // ID autogenerado
    name: '',
    image: null,
    category: null,
    price: '',
    cost: '',
    inStock: '',
    saveNewImage: false,
  };
};
const copyImageToLocalDir = async (fromUri, toUri, oldUri) => {
  try {
    if (oldUri) {
      const fileInfo = await FileSystem.getInfoAsync(oldUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileInfo.uri);
      }
    }
    await FileSystem.copyAsync({
      from: fromUri,
      to: toUri,
    });
  } catch (e) {
    console.log(e);
  }
};
function AddProductScreen() {
  const router = useRouter();
  const theme = useTheme();
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const { productId } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: productId ? 'Edita el artículo' : 'Adiciona un artículo',
    });
  }, [navigation, productId]); // Actualiza cuando el estado cambia

  useEffect(() => {
    (async () => {
      console.log('effect', productId);
      if (productId) {
        const p = await ProductModel.findById(productId);
        setProduct(p);
      } else {
        setProduct(newProduct());
      }
    })();
  }, [productId]);
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const _categories = await CategoryModel.findAll();
        setCategories(_categories);
      })();
    }, [setCategories])
  );

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Se requiere permiso para acceder a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newUri = `${FileSystem.documentDirectory}_prod_${product.id}_${Date.now()}.jpg`;
      await copyImageToLocalDir(result.assets[0].uri, newUri, product.image);
      setProduct({ ...product, image: result.assets[0].uri });
    }
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos Denegados',
        'Necesitas habilitar los permisos de la galería para seleccionar una imagen.',
        [{ text: 'OK' }]
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setProduct({
        ...product,
        image: result.assets[0].uri,
        saveNewImage: true,
      });
    }
  };

  const saveProduct = async () => {
    //await ProductManager.addProduct(product);
    //await BackendService.addProduct(product);
    try {
      //const newUri = `${FileSystem.documentDirectory}_prod_${product.id}_${Date.now()}.jpg`;
      //await copyImageToLocalDir(product.image, newUri, product.oldImage);
      //product.image = newUri;
      if (productId) {
        await ProductModel.update(product, db);
        router.push('/products');
      } else {
        await ProductModel.create(product, db);
      }
      Toast.show({
        type: 'success',
        text1: 'Operación exitosa',
        text2: 'Se guardaron los cambios correctamente',
        visibilityTime: 1500,
        position: 'bottom',
      });
      setProduct(newProduct());
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un error guardando el producto',
        visibilityTime: 1500,
        position: 'bottom',
      });
      console.log(err);
    }
  };
  const { id, name, category, price, cost, inStock } = product;
  return (
    <SharedView>
      <TextInput
        style={styles.field}
        label="Nombre"
        //keyboardType="numeric"
        value={name}
        onChangeText={(text) =>
          setProduct({
            ...product,
            name: text,
          })
        }
      />
      <ModalDropdown
        key={id}
        data={categories}
        initialValue={category?.name || 'Seleccione una catergoría'}
        onSelect={(category) => {
          setProduct({ ...product, category });
        }}
      />
      <TextInput
        style={styles.field}
        label="Precio"
        //keyboardType="numeric"
        value={String(price)}
        onChangeText={(text) =>
          setProduct({
            ...product,
            price: text !== '' ? parseFloat(text) : text,
          })
        }
      />
      <TextInput
        style={styles.field}
        label="Coste"
        keyboardType="numeric"
        value={String(cost)}
        onChangeText={(text) =>
          setProduct({
            ...product,
            cost: text !== '' ? parseFloat(text) : text,
          })
        }
      />
      <TextInput
        style={styles.field}
        label="En stock"
        keyboardType="numeric"
        value={String(inStock)}
        onChangeText={(text) =>
          setProduct({
            ...product,
            inStock: text !== '' ? parseInt(text) : text,
          })
        }
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.4 }}>
          <Image
            style={styles.productImage}
            source={
              product.image
                ? { uri: product.image }
                : require('@/assets/images/no-image.png')
            }
          />
        </View>
        <View
          style={{
            flex: 0.6,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingRight: 10,
          }}
        >
          <Button style={{ marginBottom: 10 }} onPress={pickImage}>
            Elija una foto
          </Button>
          <Button onPress={takePhoto}>Tomar una foto</Button>
        </View>
      </View>
      <View style={{ flex: 1 }}></View>
      <Button mode="contained" onPress={saveProduct}>
        {productId ? 'Actualizar' : 'Aceptar'}
      </Button>
    </SharedView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    //marginRight: 12,
    borderRadius: 4,
  },
});

export default AddProductScreen;
