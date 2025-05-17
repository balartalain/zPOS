import React from 'react';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import useNetWorkStatus from '@/src/hooks/useNetworkStatus';
import { useSync } from '@/src/context/dataContext';

export default function SynchronizeIcon() {
  const theme = useTheme();
  const isConnected = useNetWorkStatus();
  const isSyncing = useSync();
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    console.log('anim');
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
  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Icon
        name={isConnected ? 'update' : 'update-disabled'}
        size={25}
        style={{
          color: isConnected ? theme.colors.secondary : 'red',
        }}
      />
    </Animated.View>
  );
}
