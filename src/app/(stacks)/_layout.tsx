import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Button, Text, Surface, useTheme } from 'react-native-paper';

const StacksLayout = () => {
  const nav = useNavigation();
  const theme = useTheme(); 
  return (
    <Stack>
      <Stack.Screen
        name="index"        
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
          headerRight: () => {
            return (
              <Ionicons
                name="cart"
                size={24}
                onPress={() => {
                  nav.dispatch(DrawerActions.openDrawer());
                }}
                style={{marginLeft:0, marginRight: 20, color: theme.colors.primary}}
              />
            );
          },
        }}
      />
    </Stack>
  );
};

export default StacksLayout;
