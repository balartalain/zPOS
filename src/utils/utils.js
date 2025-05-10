import uuid from 'react-native-uuid';
const Utils = {
  uniqueID: () => uuid.v4(),
  isFloat: (value) => /^-?\d+(\.\d*)?$/.test(value),
  formatCurrency: (value) => `$${Number(value).toFixed(2)}`,
};
export default Utils;
