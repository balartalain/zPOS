import React from "react";
import { View } from 'react-native';
import { Stack, useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Button, Text, Surface, useTheme, Badge } from 'react-native-paper';

const StacksLayout = () => {
  const router = useRouter();
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Badge
                style={{ 
                  position: 'absolute', 
                  top: -5, 
                  right: 8, 
                  backgroundColor: theme.colors.tertiary
                }} 
                size={18} visible={true}>
                  2
              </Badge>
              <Ionicons
                name="cart"
                size={24}
                onPress={() => {
                  router.push("/(stacks)/shoppingCart");
                }}
                style={{marginLeft:0, marginRight: 20, color: theme.colors.primary}}
              />              
              </View>
            );
          },
        }}
      />
      <Stack.Screen
        name="shoppingCart"        
        options={{                    
          headerTitle: "En la cesta",        
        }}
      />
    </Stack>
  );
};

export default StacksLayout;
