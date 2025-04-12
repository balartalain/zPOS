import { View, Text, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import useProductAnimStore from '@/src/store/useProductAnimStore';

export default function productAnim() {
  const { animate, from, to, hideAnim } = useProductAnimStore();
  const aAnim = useRef(
    new Animated.ValueXY(new Animated.ValueXY(from))
  ).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (animate) {
      aAnim.setValue(from);
      Animated.parallel([
        Animated.timing(aAnim, {
          toValue: {
            x: 320,
            y: 10,
          },
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.2, // Escalar a la mitad de su tamaño original
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(hideAnim);
    } else {
      rotationAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [animate]);
  const animatedStyle = {
    transform: [
      {
        translateX: aAnim.x,
      },
      {
        translateY: aAnim.y,
      },
      {
        rotate: rotationAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
      {
        scale: scaleAnim,
      },
    ],
  };
  return (
    animate && (
      <Animated.View style={[styles.imgClone, animatedStyle]}></Animated.View>
    )
  );
}
const styles = StyleSheet.create({
  imgClone: {
    width: 40,
    height: 40,
    backgroundColor: 'gray',
    position: 'absolute',
  },
});
