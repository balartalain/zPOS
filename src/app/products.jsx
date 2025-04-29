import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, findNodeHandle } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

export default function ProductScreen() {
  const router = useRouter();
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        router.replace('/(crud)');
      })();
    }, [])
  );

  return <View />;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  square: {
    width: 50,
    height: 50,
    //position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
});
