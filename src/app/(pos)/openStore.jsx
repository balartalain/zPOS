import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, TextInput } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';

export default function OpenStore() {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Abrir la tienda',
    });
  }, [navigation]);

  const handleChangeText = (text) => {
    setInputValue(text);
    //console.log('Current value:', text);
    // Perform validation or formatting here
  };
  return (
    <SharedView>
      <Text>
        Especifique la cantidad de efectivo de la caja con la que empezará su
        turno
      </Text>
      <TextInput
        style={styles.inputText}
        label="Efectivo"
        type="flat"
        value={inputValue}
        onChangeText={handleChangeText}
      />
      <Button
        style={styles.btnOpen}
        mode="contained"
        onPress={() => {
          router.push('/openStore');
        }}
      >
        Abrir la tienda
      </Button>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  inputText: {
    marginVertical: 20,
  },
  btnOpen: {
    padding: 10,
  },
});
