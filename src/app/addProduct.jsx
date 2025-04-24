import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Menu, Divider, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import SharedView from '@/src/components/shared/sharedView';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import ModalDropdown from '../components/modalDropdown';
import ProductModel from '../model/productModel';
import Utils from '../utils/utils';
import AppwriteService from '@/src/dal/appWriteService';
/*
const uploadImageToAppwrite = async (imageUri) => {
  try {
    const response = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const file = await storage.createFile(
      'YOUR_BUCKET_ID', // Reemplaza con el ID de tu bucket
      'unique_' + Date.now() + '.jpg',
      response
    );
    return file.$id;
  } catch (error) {
    console.error('Error al subir la imagen a Appwrite:', error);
    Alert.alert(
      'Error',
      'Hubo un problema al subir la imagen. Inténtalo de nuevo.',
      [{ text: 'OK' }]
    );
    return null;
  }
};
*/
const newProduct = () => {
  return {
    id: Utils.uniqueID(), // ID autogenerado
    name: '',
    image: null,
    category: '',
    price: '',
    cost: '',
    inStock: 0,
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
  const [product, setProduct] = useState(newProduct());
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Agregar artículo',
    });
  }, [navigation]);

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
      const imageAsset = result.assets[0];
      setProduct({
        ...product,
        image: result.assets[0].uri,
        imageAsset,
      });
    }
  };

  const saveProduct = async () => {
    //await ProductManager.addProduct(product);
    //await BackendService.addProduct(product);
    try {
      const newUri = `${FileSystem.documentDirectory}_prod_${product.id}_${Date.now()}.jpg`;
      //await copyImageToLocalDir(product.image, newUri, product.oldImage);
      //product.image = newUri;
      //await ProductModel.create(product, db);
      await new AppwriteService().uploadImage(product.imageAsset);

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
  return (
    <SharedView>
      <TextInput
        style={styles.field}
        label="Nombre"
        value={product.name}
        onChangeText={(text) => setProduct({ ...product, name: text })}
      />
      <Button
        mode="outlined"
        icon="chevron-down"
        buttonColor={theme.colors.surfaceVariant}
        textColor={theme.colors.onSurfaceVariant}
        labelStyle={{ margin: 15 }}
        contentStyle={{
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
        }}
        style={{
          borderRadius: 0,
          marginBottom: 20,
          paddingVertical: 5,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.onSurfaceVariant,
          justifyContent: 'left',
        }}
        onPress={() => setOpenCategoryModal(true)}
      >
        {product.category || 'Selecciona una Categoria'}
      </Button>
      <ModalDropdown
        data={['Bebidas', 'Miscelania']}
        selectedValue={product?.category}
        onSelect={(category) => {
          setProduct({ ...product, category });
          setOpenCategoryModal(false);
        }}
        onCloseModal={() => setOpenCategoryModal(false)}
        isModalVisible={openCategoryModal}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      ></View>
      <TextInput
        style={styles.field}
        label="Precio"
        keyboardType="numeric"
        value={product.price}
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
        value={product.cost}
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
        value={product.inStock}
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
        Agregar
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
    backgroundColor: '#ccc', // Color de fondo si la imagen no carga
  },
});

export default AddProductScreen;
