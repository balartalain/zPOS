import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { Colors } from "@/src/themes/theme1/colors";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});
const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const paperTheme =
  colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={paperTheme}>
        <Drawer>
          <Drawer.Screen name="(stacks)" options={{ headerShown: false, drawerLabel: 'Ir a Venta'  }}/>
          <Drawer.Screen name='+not-found' options={{ drawerItemStyle: { display: 'none' }}}/>
          <Drawer.Screen name='about' />
        </Drawer>        
        </ThemeProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default RootLayout;
