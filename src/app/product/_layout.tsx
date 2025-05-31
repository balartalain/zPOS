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
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerTitle: 'Agregar un producto',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerTitle: 'Editar el producto',
        }}
      />
    </Stack>
  );
};

export default ProductsLayout;
