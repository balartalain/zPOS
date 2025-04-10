import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import OnLayout from '../components/onLayout';

export default function AboutScreen() {
  return (
    <OnLayout>
      {({ width, height, x, y }) => (
        <>
          <Text>
            Mi size {width} {height} {x} {y}
          </Text>
        </>
      )}
    </OnLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
