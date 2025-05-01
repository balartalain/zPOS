import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageUtils = {
  set: async function (key, items) {
    await AsyncStorage.setItem(key, JSON.stringify(items));
  },
  add: async function (key, item) {
    const storedItems = await AsyncStorage.getItem(key);
    const items = storedItems ? JSON.parse(storedItems) : [];
    items.push(item);
    await AsyncStorage.setItem(key, JSON.stringify(items));
  },
  update: async function (key, item) {
    const storedItems = await AsyncStorage.getItem(key);
    let items = storedItems ? JSON.parse(storedItems) : [];
    items = items.map((_item) =>
      _item.objectId === item.objectId ? { ..._item, ...item } : _item
    );
    await AsyncStorage.setItem(key, JSON.stringify(items));
  },
  delete: async function (key, id) {
    const storedItems = await AsyncStorage.getItem(key);
    const items = storedItems ? JSON.parse(storedItems) : [];
    const newItems = items.filter((item) => item.objectId !== id);
    await AsyncStorage.setItem(key, JSON.stringify(newItems));
  },
  findAll: async function (key) {
    const storedItems = await AsyncStorage.getItem(key);
    const items = storedItems ? JSON.parse(storedItems) : [];
    return items;
  },
  findById: async function (key, id) {
    const storedItems = await AsyncStorage.getItem(key);
    const items = storedItems ? JSON.parse(storedItems) : [];
    return items.find((i) => i.objectId === id);
  },
};
export default AsyncStorageUtils;
