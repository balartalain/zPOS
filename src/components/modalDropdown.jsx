import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedButton from './shared/sharedButton';

const ModalDropdown = ({ table, initialId, onSelect }) => {
  const theme = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Seleccione una opción');
  const [data, setData] = useState([]);
  const toggleModal = () => setModalVisible(!isModalVisible);

  useEffect(() => {
    (async () => {
      //console.log('modal drop down');
      const storedData = await AsyncStorage.getItem(table.split('_')[0]);
      const _data = storedData ? JSON.parse(storedData) : [];
      const _initialValue = _data.find((d) => d.id === initialId);
      if (_initialValue) {
        setSelectedValue(_initialValue.name);
      }
      setData(storedData ? JSON.parse(storedData) : []);
    })();
  }, [table, initialId]);

  const handleSelect = (item) => {
    onSelect(item.id);
    setSelectedValue(item.name);
    toggleModal();
  };
  return (
    <View style={styles.container}>
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
          marginBottom: 20,
          borderRadius: 2,
          paddingVertical: 5,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.onSurfaceVariant,
          justifyContent: 'left',
        }}
        onPress={toggleModal}
      >
        {selectedValue}
      </Button>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {data && data.length > 0 && (
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <SharedButton
              outlined
              label="Cerrar"
              style={styles.closeButton}
              onPress={toggleModal}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  closeText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ModalDropdown;
