import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default ImageListScreen = () => {
  const [imageUris, setImageUris] = useState([]);
  const [error, setError] = useState(null);
  const directoryUri = FileSystem.documentDirectory;
  useEffect(() => {
    const loadImages = async () => {
      try {
        const result = await FileSystem.readDirectoryAsync(directoryUri);
        const imageFiles = result.filter((file) => {
          const lowerCaseFile = file.toLowerCase();
          return (
            lowerCaseFile.endsWith('.png') ||
            lowerCaseFile.endsWith('.jpg') ||
            lowerCaseFile.endsWith('.jpeg') ||
            lowerCaseFile.endsWith('.gif')
          );
        });

        const imageUris = imageFiles.map((file) => `${directoryUri}/${file}`);
        setImageUris(imageUris);
        setError(null);
      } catch (e) {
        setError(`Error al leer el directorio: ${e.message}`);
        setImageUris([]);
      }
    };
    //console.log('Loading Images...');
    loadImages();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageUris.length === 0 ? (
        <Text>No se encontraron imágenes en este directorio.</Text>
      ) : (
        <FlatList
          data={imageUris}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
          numColumns={3} // O el número de columnas que desees
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    //flex: 1,
    aspectRatio: 1, // Para mantener las imágenes cuadradas
    margin: 2,
    overflow: 'hidden',
    width: '30%',
  },
  image: {
    flex: 1,
  },
});
