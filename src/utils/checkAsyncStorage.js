import AsyncStorage from '@react-native-async-storage/async-storage';

const checkStoredState = async (name) => {
  try {
    const storedState = await AsyncStorage.getItem(name);
    //console.log('`🛠 Estado guardado en ${name}:`', storedState);
  } catch (error) {
    console.error('`❌ Error al obtener el estado de ${name}:`', error);
  }
};
const removeStoredStore = async (name) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    console.error('`❌ Error borrar el store ${name}:`', error);
  }
};
export { checkStoredState, removeStoredStore };
