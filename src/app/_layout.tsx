import React, { useEffect, useState } from 'react';
import Drawer from 'expo-router/drawer';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
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
import Toast from 'react-native-toast-message';
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
    <SQLiteProvider databaseName="zpos.db" onInit={migrateDbIfNeeded}>
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
                  name="addProduct"
                  options={{ drawerItemStyle: { display: 'none' } }}
                />
              </Drawer>
            </ThemeProvider>
          </GestureHandlerRootView>
        )}
        <LoadingModal />
        <ProductAnim />
        <Toast />
      </PaperProvider>
    </SQLiteProvider>
  );
  async function migrateDbIfNeeded(db: any) {
    //await db.execAsync(`PRAGMA user_version = 0`);
    //await db.runAsync('DROP table IF EXISTS pending_operation');
    const DATABASE_VERSION = 1;
    let { user_version: currentDbVersion } = await db.getFirstAsync(
      'PRAGMA user_version'
    );
    if (currentDbVersion >= DATABASE_VERSION) {
      return;
    }
    if (currentDbVersion === 0) {
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE pending_operation (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          model TEXT NOT NULL,
          operation TEXT NOT NULL,
          data TEXT NOT NULL,
          created DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Initial migration applied, DB version:', DATABASE_VERSION);
      // await db.runAsync(
      //   'INSERT INTO todos (value, intValue) VALUES (?, ?)',
      //   'hello',
      //   1
      // );
      // await db.runAsync(
      //   'INSERT INTO todos (value, intValue) VALUES (?, ?)',
      //   'world',
      //   2
      // );
      currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    //await db.runAsync("DELETE FROM productos;");
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  }
};
export default RootLayout;
