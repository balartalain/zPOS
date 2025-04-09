import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import useTicketStore from '@/src/store/useTicketStore';

export default function payTicket() {
  const navigation = useNavigation();
  const { getTotal } = useTicketStore();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'A Pagar',
    });
  }, [navigation]);

  return (
    <SharedView>
      <View>
        <Surface style={[styles.surface]} elevation={1}>
          <Text variant="displayMedium">{`Total: $${getTotal()}`}</Text>
        </Surface>
      </View>
      <View>
        <Button mode="contained" style={styles.cobrar} onPress={() => {}}>
          Efectivo
        </Button>
        <Button mode="contained" style={styles.cobrar} onPress={() => {}}>
          Transeferencia
        </Button>
      </View>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  surface: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  cobrar: {
    paddingVertical: 10,
    marginTop: 20,
  },
});
