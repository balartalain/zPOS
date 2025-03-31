import { View, StyleSheet } from 'react-native';
import React from 'react';

export default function SharedView(props) {
  const { children, style, ...rest } = props;

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
