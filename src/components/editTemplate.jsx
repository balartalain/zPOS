/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { TextInput, Button, Menu, Divider, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import SharedView from '@/src/components/shared/sharedView';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import ModalDropdown from '@/src/components/modalDropdown';
import Utils from '@/src/utils/utils';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';
import { useData } from '@/src/context/dataContext';

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
function Edit({ fields, table, id = null, handleSave = null }) {
  const isFocused = useIsFocused();
  const router = useRouter();
  const theme = useTheme();
  const { create, update } = useData();
  const [record, setRecord] = useState({});

  const newRecord = React.useCallback(() => {
    return fields.reduce((obj, field) => {
      obj[field.column] = field.column === 'objectId' ? Utils.uniqueID() : '';
      return obj;
    }, {});
  }, [fields]);
  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerTitle: id ? 'Edita el artículo' : 'Adiciona un artículo',
  //     });
  //   }, [id]); // Actualiza cuando el estado cambia
  useEffect(() => {
    (async () => {
      if (id) {
        const p = await AsyncStorageUtils.findById(table, id);
        setRecord(p);
      } else {
        setRecord(newRecord());
      }
    })();
  }, [isFocused, id, table, newRecord]);

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
      //const newUri = `${FileSystem.documentDirectory}_${record.id}_${Date.now()}.jpg`;
      //await copyImageToLocalDir(result.assets[0].uri, newUri, product.image);
      setRecord({ ...record, image: result.assets[0].uri });
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
      setRecord({
        ...record,
        image: result.assets[0].uri,
        saveNewImage: true,
      });
    }
  };

  const save = async () => {
    //await ProductManager.addProduct(product);
    //await BackendService.addProduct(product);
    try {
      //const newUri = `${FileSystem.documentDirectory}_prod_${product.id}_${Date.now()}.jpg`;
      //await copyImageToLocalDir(product.image, newUri, product.oldImage);
      //product.image = newUri;
      if (handleSave) {
        handleSave(record);
        return;
      } else if (id) {
        console.log(id);
        update(table, record);
        //await AsyncStorageUtils.update(table, record);
        //await serviceClass.update(record, db);
      } else {
        create(table, record);
        //await AsyncStorageUtils.add(table, record);
        //await serviceClass.add(record, db);
      }
      router.push(`/${table}`);
      Toast.show({
        type: 'success',
        text1: 'Operación exitosa',
        text2: 'Se guardaron los cambios correctamente',
        position: 'bottom',
      });
      //setProduct(newProduct());
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ocurrió un error guardando los cambios',
        position: 'bottom',
      });
      console.log(err);
    }
  };

  return (
    <SharedView>
      {fields
        .filter((f) => !f.hidden)
        .map((f, index) => {
          const { type, label, column } = f;
          switch (type) {
            case 'string':
            case 'numeric':
              return (
                <TextInput
                  key={index}
                  style={styles.field}
                  label={label}
                  keyboardType={type}
                  value={String(record?.[column])}
                  onChangeText={(text) => {
                    setRecord({
                      ...record,
                      [column]: type !== 'string' ? parseFloat(text) : text,
                    });
                  }}
                />
              );

            case 'image':
              return (
                <View key={index} style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.4 }}>
                    <Image
                      style={styles.image}
                      source={
                        record?.image
                          ? { uri: record[column] }
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
              );
            case 'reference': {
              return (
                <ModalDropdown
                  key={index}
                  table={column}
                  initialId={
                    typeof record?.[column] === 'string'
                      ? record[column]
                      : record?.[column]?.objectId
                  }
                  onSelect={(id) => {
                    setRecord((r) => ({ ...r, [column]: id }));
                  }}
                />
              );
            }
          }
        })}

      <View style={{ flex: 1 }}></View>
      <Button style={styles.btn} mode="contained" onPress={save}>
        Guardar
      </Button>
    </SharedView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    //marginRight: 12,
    borderRadius: 4,
  },
  btn: {
    padding: 10,
  },
});

export default Edit;
