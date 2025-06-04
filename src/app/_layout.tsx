import React, { useEffect, useState } from 'react';
import Drawer from 'expo-router/drawer';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, View, Text } from 'react-native';
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
import { useRouter } from 'expo-router';
import merge from 'deepmerge';
import { Colors } from '@/src/themes/theme1/colors';
import useUserStore from '@/src/store/useUserStore';
import Toast from 'react-native-toast-message';
import { removeStoredStore } from '@/src/utils/checkAsyncStorage';
import ProductAnim from '@/src/components/productAnim';
import { DataProvider } from '@/src/context/dataContext';
import toastConfig from '../toastConfig';
import { UserProvider } from '@/src/context/userContext';
import { HeaderProvider } from '@/src/context/headerContext';
import Header from '@/src/components/header';
const customDarkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: { ...MD3DarkTheme.colors, ...Colors.dark },
};
const customLightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: { ...MD3LightTheme, ...Colors.light },
};
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});
const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

const RootLayout = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  return (
    <SQLiteProvider databaseName="zpos.db" onInit={migrateDbIfNeeded}>
      <UserProvider>
        <PaperProvider theme={paperTheme}>
          <DataProvider>
            <HeaderProvider>
              <Header />
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider value={paperTheme}>
                  <Drawer>
                    <Drawer.Screen
                      name="pos"
                      options={{
                        headerShown: false,
                        drawerLabel: 'Ir a Venta',
                      }}
                    />
                    <Drawer.Screen
                      name="+not-found"
                      options={{ drawerItemStyle: { display: 'none' } }}
                    />
                    <Drawer.Screen
                      name="product"
                      options={{ headerShown: false, drawerLabel: 'Artículos' }}
                    />
                    <Drawer.Screen
                      name="category"
                      options={{
                        headerShown: false,
                        drawerLabel: 'Categorías',
                      }}
                    />
                    <Drawer.Screen
                      name="refreshMasterdata"
                      options={{
                        headerShown: false,
                        drawerLabel: 'Acrualizar Catálogo',
                      }}
                    />
                    <Drawer.Screen
                      name="login"
                      options={{
                        headerShown: false,
                        drawerLabel: 'Iniciar Sessión',
                      }}
                    />
                    <Drawer.Screen
                      name="logout"
                      options={{
                        headerShown: false,
                        drawerLabel: 'Cerrar Sessión',
                      }}
                    />
                    <Drawer.Screen
                      name="index"
                      options={{
                        headerShown: false,
                        drawerItemStyle: { display: 'none' },
                      }}
                    />
                  </Drawer>
                </ThemeProvider>
              </GestureHandlerRootView>
              <Toast config={toastConfig} />
            </HeaderProvider>
            <ProductAnim />
          </DataProvider>
        </PaperProvider>
      </UserProvider>
    </SQLiteProvider>
  );
  async function migrateDbIfNeeded(db: any) {
    //await db.execAsync(`PRAGMA user_version = 0`);
    //await db.runAsync('DROP table IF EXISTS pending_operation');
    //await db.runAsync('DELETE from pending_operation');
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
      //console.log('Initial migration applied, DB version:', DATABASE_VERSION);
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
