import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Button, Text, Surface, useTheme, Badge } from 'react-native-paper';
import SynchronizeIcon from '@/src/components/synchronizeIcon';

const ProductsLayout = () => {
  const router = useRouter();
  const nav = useNavigation();
  const theme = useTheme();

  return (
    <Stack screenOptions={{ headerRight: () => <SynchronizeIcon /> }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Categorías',
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
      <Stack.Screen
        name="add"
        options={{
          headerTitle: 'Agregar una Categoría',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerTitle: 'Editar la Categoría',
        }}
      />
    </Stack>
  );
};

export default ProductsLayout;
