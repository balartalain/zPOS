import React, { useEffect, useState } from 'react';
import Drawer from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import merge from 'deepmerge';
import { Colors } from '@/src/themes/theme1/colors';
import Login from '@/src/components/login';
import useUserStore from '@/src/store/useUserStore';
import LoadingModal from '@/src/components/loadingModal';
import { removeStoredStore } from '@/src/utils/checkAsyncStorage';
import ProductAnim from '@/src/components/productAnim';

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...Colors.dark },
};
const customLightTheme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme, ...Colors.light },
};
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});
const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  //const paperTheme = CombinedDarkTheme;
  removeStoredStore('user-store');
  removeStoredStore('ticket-store');
  const { isAuthenticated } = useUserStore();
  return (
    <PaperProvider theme={paperTheme}>
      {!isAuthenticated ? (
        <Login />
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={paperTheme}>
            <Drawer>
              <Drawer.Screen
                name="(stacks)"
                options={{ headerShown: false, drawerLabel: 'Ir a Venta' }}
              />
              <Drawer.Screen
                name="+not-found"
                options={{ drawerItemStyle: { display: 'none' } }}
              />
              <Drawer.Screen name="about" />
              <Drawer.Screen
                name="products"
                options={{ drawerLabel: 'Articulos' }}
              />
              <Drawer.Screen
                name="addProducts"
                options={{ drawerItemStyle: { display: 'none' } }}
              />
            </Drawer>
          </ThemeProvider>
        </GestureHandlerRootView>
      )}
      <LoadingModal />
      <ProductAnim />
    </PaperProvider>
  );
};
export default RootLayout;
