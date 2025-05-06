import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput, TextuseTheme } from 'react-native-paper';
import SharedView from '@/src/components/shared/sharedView';
import useTicketStore from '@/src/store/useTicketStore';
export default function PayTicket() {
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
      <View style={{ flex: 0.3 }}></View>
      <View
        style={{
          flex: 0.7,
          flexDirection: 'row',
          flexWrap: 'wrap',

          justifyContent: 'space-between',
        }}
      >
        <TextInput
          style={{ marginBottom: 2, width: '100%' }}
          //value={'10.5'}
          keyboardType="numeric"
          label="Amount"
        />
        <Button
          style={[styles.btn, { width: '29%', marginRight: 5 }]}
          mode="contained"
          onPress={() => {}}
        >
          Efectivo
        </Button>
        <Button
          style={[styles.btn, { width: '29%', marginRight: 5 }]}
          mode="contained"
          onPress={() => {}}
        >
          Transfer
        </Button>
        <Button style={[styles.btn, styles.btnDone]} mode="contained">
          Done
        </Button>
      </View>
    </SharedView>
  );
}
const styles = StyleSheet.create({
  btn: {
    border: 0,
    borderRadius: 0,
    height: 50,
    justifyContent: 'center',
  },
  btnDone: {
    flex: 1,
  },
});
