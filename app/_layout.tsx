import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="(stacks)" options={{ headerShown: false  }}/>
        <Drawer.Screen name='+not-found' options={{ drawerItemStyle: { display: 'none' }}}/>
        <Drawer.Screen name='about' />
      </Drawer>      
    </GestureHandlerRootView>
  );
};

export default RootLayout;
