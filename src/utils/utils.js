import uuid from 'react-native-uuid';
const Utils = {
  uniqueID: () => uuid.v4(),
  isFloat: (value) => /^-?\d+(\.\d*)?$/.test(value),
};
export default Utils;
