import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const StackPos = () => {
  const router = useRouter();
  return (
    <View>
      <Text>Esta es la terminal de punto de venta</Text>
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