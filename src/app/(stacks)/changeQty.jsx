import React, { useLayoutEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import NumericKeyboard from '../../components/numericKeyboard';
import withApproval from '../../components/withApproval';

function ChangeQtyScreen() {
    const navigation = useNavigation();
    const { productName } = useLocalSearchParams();  
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: productName
        });
    }, [navigation, productName]); // Actualiza cuando el estado cambia
  return (
    <View style={styles.container}>
      <NumericKeyboard/>
    </View>
  );
}
export default withApproval(ChangeQtyScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
});
