import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import SharedText from './sharedText';

export default function SharedButton({
  label,
  onPress,
  style,
  disabled = false,
  textVariant = 'h6',
  textStyles = {},
}) {
  const { colors } = useTheme();

  const h1 = textVariant === 'h1';
  const h2 = textVariant === 'h2';
  const h3 = textVariant === 'h3';
  const h4 = textVariant === 'h4';
  const h5 = textVariant === 'h5';
  const h6 = textVariant === 'h6';
  const p = textVariant === 'p';
  const combinedStyle = StyleSheet.flatten([
    { backgroundColor: colors.primary },
    _styles.button,
    style,
  ]);
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={combinedStyle}
    >
      <SharedText
        h1={h1}
        h2={h2}
        h3={h3}
        h4={h4}
        h5={h5}
        h6={h6}
        p={p}
        style={[_styles.textStyles, { color: colors.onPrimary, ...textStyles }]}
        title={label}
      />
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
