import React, { useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import useModalStore from '@/src/store/useModalStore';
const LoadingModal = () => {
  const { colors } = useTheme();
  const { isVisible, label } = useModalStore();
  const onRequestClose = () => {};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose} // Importante para Android (botón de "atrás")
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.modalText}>{label}</Text>
        </View>
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
  modalView: {
    borderRadius: 2,
    padding: 15,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 0,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoadingModal;
