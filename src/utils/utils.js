export default Utils = {
  uniqueID: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
};
