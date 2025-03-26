import { View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Button, Text, useTheme } from 'react-native-paper';

const StackPos = () => {
  const router = useRouter();
  const theme = useTheme(); 
  return (
    <View>
      <Text variant="titleLarge">Esta es la terminal de punto de venta</Text>
      <Button  mode="text" onPress={() => console.log('Pressed')} style={{ margin:10, backgroundColor: theme.colors.onPrimary }}>
        text
      </Button>
      <Button  mode="contained" onPress={() => console.log('Pressed')} style={{ margin:10 }}>
        contained
      </Button>
      <Button  mode="elevated" onPress={() => console.log('Pressed')} style={{ margin:10 }}>
        elevated
      </Button>
      <Button  mode="outlined" onPress={() => console.log('Pressed')} style={{ margin:10 }}>
        outlined
      </Button>
      <Button  mode="contained-tonal" onPress={() => console.log('Pressed')} style={{ margin:10 }}>
        contained-tonal
      </Button>
      <Text
        onPress={() => {
          router.push("/(stacks)/users");
        }}
      >
        Go to users page
      </Text>
    </View>
  );
};

export default StackPos;