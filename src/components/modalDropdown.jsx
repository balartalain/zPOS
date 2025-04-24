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

const ModalDropdown = ({
  data,
  onSelect,
  isModalVisible = false,
  onCloseModal,
}) => {
  const theme = useTheme();

  const handleSelect = (item) => {
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button style={styles.closeButton} onPress={onCloseModal}>
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
