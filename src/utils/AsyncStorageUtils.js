import AsyncStorage from '@react-native-async-storage/async-storage';
import { eventBus, eventName } from '@/src/event/eventBus';
eventBus.on(eventName.ADD_PRODUCT, (items) =>
  AsyncStorageUtils.add('product', items)
);
eventBus.on(eventName.UPDATE_PRODUCT, (items) =>
  AsyncStorageUtils.update('product', items)
);
eventBus.on(eventName.ADD_CATEGORY, (item) =>
  AsyncStorageUtils.add('category', item)
);
eventBus.on(eventName.UPDATE_CATEGORY, (item) =>
  AsyncStorageUtils.update('category', item)
);
const AsyncStorageUtils = {
  set: async function (key, items) {
    await AsyncStorage.setItem(key, JSON.stringify(items));
    eventBus.emit(`CHANGED_${key.toUpperCase()}`, {});
  },
  add: async function (key, item) {
    const storedItems = await AsyncStorage.getItem(key);
    const items = storedItems ? JSON.parse(storedItems) : [];
    items.push(item);
    await AsyncStorage.setItem(key, JSON.stringify(items));
    eventBus.emit(`CHANGED_${key.toUpperCase()}`, item);
  },
  update: async function (key, _items) {
    const storedItems = await AsyncStorage.getItem(key);
    const updateItems = _items.length ? _items : [_items];
    let items = storedItems ? JSON.parse(storedItems) : [];
    items = items.map((_item) => {
      const findItem = updateItems.find((it) => it.id === _item.id);
      return findItem ? { ..._item, ...findItem } : _item;
    });
    await AsyncStorage.setItem(key, JSON.stringify(items));
    const event = `CHANGED_${key.toUpperCase()}`;
    //console.log('AsyncStorage update');
    eventBus.emit(event, updateItems);
  },
  delete: async function (key, id) {
    const storedItems = await AsyncStorage.getItem(key);
    const items = storedItems ? JSON.parse(storedItems) : [];
    const newItems = items.filter((item) => item.id !== id);
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
    return items.find((i) => i.id === id);
  },
};
export default AsyncStorageUtils;
