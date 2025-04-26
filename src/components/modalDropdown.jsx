import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Menu,
  Divider,
  useTheme,
} from 'react-native-paper';

const ModalDropdown = ({ data, onSelect, selectedValue }) => {
  const theme = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleSelect = (item) => {
    onSelect(item);
    toggleModal();
  };
  console.log('[data]=>', data);
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
          borderRadius: 0,
          marginBottom: 20,
          paddingVertical: 5,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.onSurfaceVariant,
          justifyContent: 'left',
        }}
        onPress={toggleModal}
      >
        {selectedValue || 'Selecciona una Categoria'}
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
            <Button style={styles.closeButton} onPress={toggleModal}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
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
    //padding: 10,
    //backgroundColor: '#e74c3c',
    //borderRadius: 5,
  },
  closeText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ModalDropdown;
