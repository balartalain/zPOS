module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // Add other relevant plugins here
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    'react-native/react-native': true,
  },
  plugins: [
    'react',
    'react-hooks',
    'react-native',
    // Add other relevant plugins here
  ],
  rules: {
    // Add or override specific rules here
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
  ignorePatterns: [
    '.expo/',
    '.eas-build/',
    'node_modules/',
    'android/build/',
    'ios/build/',
    'ios/DerivedData/',
    'web-build/',
  ],
};
