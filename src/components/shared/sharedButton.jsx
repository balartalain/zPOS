import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function SharedButton({
  label,
  onPress,
  styles = {},
  textStyles = {},
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[_styles.button, { backgroundColor: colors.primary, ...styles }]}
    >
      <Text
        style={[_styles.textStyles, { color: colors.onPrimary, ...textStyles }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
const _styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
});
