import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Card, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import SharedView from '@/src/components/shared/sharedView';

const newProduct = () => {
  return {
    id: Date.now().toString(), // ID autogenerado
    name: '',
    image: null,
    category: '',
    price: '',
    cost: '',
    inStock: 0,
  };
};
function AddProductScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Agregar artículo',
    });
  }, [navigation]);

  const [product, setProduct] = useState(newProduct());
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
      console.log('Foto tomada:', result.assets[0].uri);
      setProduct({ ...product, image: result.assets[0].uri });
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      console.log(result);
      setProduct({ ...product, image: result.assets[0].uri });
    }
  };

  // Función para guardar el producto
  const saveProduct = () => {
    Toast.show({
      type: 'success',
      text1: 'Operación exitosa',
      text2: 'Se guardaron los cambios correctamente',
    });
    setProduct(newProduct());
  };

  return (
    <SharedView>
      <TextInput
        style={styles.field}
        label="Nombre"
        value={product.name}
        onChangeText={(text) => setProduct({ ...product, name: text })}
      />
      <TextInput
        style={styles.field}
        label="Precio"
        keyboardType="numeric"
        value={product.price}
        onChangeText={(text) => setProduct({ ...product, price: text })}
      />
      <TextInput
        style={styles.field}
        label="Coste"
        keyboardType="numeric"
        value={product.cost}
        onChangeText={(text) => setProduct({ ...product, cost: text })}
      />
      <TextInput
        style={styles.field}
        label="En stock"
        keyboardType="numeric"
        value={product.inStock}
        onChangeText={(text) => setProduct({ ...product, inStock: text })}
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
        <View style={{ flex: 0.6, justifyContent: 'center', paddingRight: 10 }}>
          <Button
            style={{ marginBottom: 10 }}
            mode="outlined"
            onPress={pickImage}
          >
            Elija una foto
          </Button>
          <Button mode="outlined" onPress={takePhoto}>
            Tomar una foto
          </Button>
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
