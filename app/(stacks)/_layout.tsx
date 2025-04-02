import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

const StacksLayout = () => {
  const nav = useNavigation();
  return (
    <Stack>
      <Stack.Screen
        name="pos"        
        options={{                    
          headerTitle: "Nueva Venta",          
          headerLeft: () => {
            return (
              <Ionicons
                name="menu"
                size={24}
                onPress={() => {
                  nav.dispatch(DrawerActions.openDrawer());
                }}
                style={{marginLeft:0, marginRight: 20}}
              />
            );
          },
        }}
      />
    </Stack>
  );
};

export default StacksLayout;
