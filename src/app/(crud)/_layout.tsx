import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Button, Text, Surface, useTheme, Badge } from 'react-native-paper';

const ProductsLayout = () => {
  const router = useRouter();
  const nav = useNavigation();
  const theme = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Articulos',
          headerLeft: () => {
            return (
              <Ionicons
                name="menu"
                size={24}
                onPress={() => {
                  nav.dispatch(DrawerActions.openDrawer());
                }}
                style={{ paddingLeft: 0, marginLeft: 0, marginRight: 13 }}
              />
            );
          },
        }}
      />
      <Stack.Screen name="add" />
      <Stack.Screen name="edit" />
    </Stack>
  );
};

export default ProductsLayout;
