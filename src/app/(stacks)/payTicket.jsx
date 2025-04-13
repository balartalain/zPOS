import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import useTicketStore from '@/src/store/useTicketStore';

export default function payTicket() {
  const router = useRouter();
  const navigation = useNavigation();
  const { getTotal, completeTicket } = useTicketStore();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'A Pagar',
    });
  }, [navigation]);
  const done = (pm) => {
    completeTicket(pm);
    router.push('/');
  };
  return (
    <SharedView>
      <View>
        <Surface style={[styles.surface]} elevation={1}>
          <Text variant="displayMedium">{`Total: $${getTotal()}`}</Text>
        </Surface>
      </View>
      <View>
        <Button
          mode="contained"
          style={styles.payBtn}
          onPress={() => done('Efectivo')}
        >
          Efectivo
        </Button>
        <Button
          mode="contained"
          style={styles.payBtn}
          onPress={() => done('Transferencia')}
        >
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
  payBtn: {
    paddingVertical: 10,
    marginTop: 20,
  },
});
