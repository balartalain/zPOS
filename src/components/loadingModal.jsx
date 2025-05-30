import React, { useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const LoadingModal = ({ visible = false, text = '' }) => {
  const { colors } = useTheme();
  const onRequestClose = () => {};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose} // Importante para Android (botón de "atrás")
    >
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.modalText}>{text}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente para bloquear la interacción
  },
  modalText: {
    marginBottom: 0,
    textAlign: 'center',
    marginTop: 10,
    color: '#FFFFFF',
  },
});

export default LoadingModal;
