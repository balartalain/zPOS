import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; 
import NumericKeyboard from '../../components/numericKeyboard';

export default function ChangeQtyScreen() {
  return (
    <View style={styles.container}>
      <NumericKeyboard/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
});
