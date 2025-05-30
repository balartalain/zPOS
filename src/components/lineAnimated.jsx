import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import useNetWorkStatus from '@/src/hooks/useNetworkStatus';
import { useSync } from '@/src/context/dataContext';
import useUserStore from '../store/useUserStore';
const { width } = Dimensions.get('window');
const LineAnimated = () => {
  const theme = useTheme();
  //const isConnected = useNetWorkStatus();
  const isSyncing = useSync();
  const translateX = useRef(new Animated.Value(-width)).current;
  const animationRunning = useRef(null);
  const stopAnimation = useRef(false);

  const { user, session } = useUserStore();
  const animatedLoop = React.useCallback(() => {
    animationRunning.current = Animated.timing(translateX, {
      toValue: width,
      duration: 1000,
      useNativeDriver: true,
    });
    animationRunning.current.start(() => {
      translateX.setValue(-width);
      if (!stopAnimation.current) {
        animatedLoop();
      } else {
        animationRunning.current = false;
      }
    });
  }, [translateX]);

  useEffect(() => {
    if (isSyncing && !animationRunning.current) {
      stopAnimation.current = false;
      animatedLoop();
    } else if (animationRunning.current) {
      stopAnimation.current = true;
    }
  }, [isSyncing, animatedLoop]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.line, { transform: [{ translateX }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#B0BEC5',
    overflow: 'hidden',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  line: {
    width: '30%',
    height: 2,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});

export default LineAnimated;
