import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db', // Color principal personalizado
    accent: '#f1c40f',  // Color de acento
    background: '#ecf0f1', // Fondo
    surface: '#ffffff', // Superficie (por ejemplo, tarjetas)
    text: '#2c3e50', // Texto
  },
  roundness: 1,
};
const RootLayout = () => {
  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen name="(stacks)" options={{ headerShown: false  }}/>
          <Drawer.Screen name='+not-found' options={{ drawerItemStyle: { display: 'none' }}}/>
          <Drawer.Screen name='about' />
        </Drawer>
        
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default RootLayout;
