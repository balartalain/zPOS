import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; 

export default function SalesScreen() {
  return (
    <View style={styles.container}>
      <Link href="/addProduct" style={styles.button}>
          Add Product 1
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
