import { View , StyleSheet} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import ProductList from '../../components/productList';
import { sortRoutes } from "expo-router/build/sortRoutes";

function TicketScreen() {
  const router = useRouter();
  const theme = useTheme(); 

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Surface style={styles.surface} elevation={4}>
        <Text variant="displayMedium">Total: $200.00</Text>    
      </Surface>
      <Text
        onPress={() => {
          router.push("/(stacks)/users");
        }}
      >
        Go to users page
      </Text>
      <ProductList/>
      <Button mode="contained"
        style={styles.cobrar} onPress={() => console.log("Cobrar")}>
        COBRAR
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  surface: {
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cobrar:{
    padding:10
  }
});
export default TicketScreen;