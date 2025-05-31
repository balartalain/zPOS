import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Appbar } from 'react-native-paper';

import { DrawerActions, useNavigation } from '@react-navigation/native';
import { usePathname } from 'expo-router';
import { useHeader } from '../context/headerContext';
import useNetworkStatus from '@/src/hooks/useNetworkStatus';
import { useData, useSync } from '../context/dataContext';

export default function Header() {
  const navigation = useNavigation();
  const router = useRouter();
  const isConnected = useNetworkStatus();
  //const { hasPendingOperations } = useData();
  const isSyncing = useSync();
  //const [isSyncing] = useState(true);
  const { headerContent, headerActions } = useHeader();
  const pathname = usePathname();
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    //console.log('anim');
    if (isSyncing) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          //easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isSyncing, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const canGoBack = pathname?.split('/').length - 1 > 1;

  return (
    <Appbar.Header elevated={true} style={{ height: 60, paddingRight: 10 }}>
      {canGoBack ? (
        <Appbar.BackAction onPress={router.back} />
      ) : (
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      )}
      <Appbar.Content title={headerContent} />
      {headerActions}
      {!isSyncing && (
        <Ionicons
          name={`cloud-${!isConnected ? 'offline-' : ''}outline`}
          size={22}
          color={`${isConnected ? 'green' : 'red'}`}
        />
      )}
      {isSyncing && (
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="sync" size={22} color="green" />
        </Animated.View>
      )}
    </Appbar.Header>
  );
}
