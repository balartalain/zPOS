import { useSQLiteContext } from 'expo-sqlite';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  ServiceRegistry,
  CategoryService,
  ProductService,
} from '@/src/service';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';

const DataContext = createContext(null);
const SyncContext = createContext(null);
let timeout = null;
export function DataProvider({ children }) {
  const db = useSQLiteContext();
  const syncTimeoutRef = useRef(null);
  const isSyncingRef = useRef(false);
  const [hasChangedData, setHasChangedData] = useState(false);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    syncData();
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [syncData]);
  const syncData = useCallback(async () => {
    try {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (isSyncingRef.current) {
        console.log('Sincronización en curso');
        return;
      }
      isSyncingRef.current = true;
      //await db.runAsync('DELETE from pending_operation');
      const pending = await db.getAllAsync(
        'SELECT * FROM pending_operation ORDER BY created ASC'
      );
      for (const record of pending) {
        const { id, model, operation } = record;
        const data = JSON.parse(record.data);
        const serviceClass = ServiceRegistry.get(model);
        if (!serviceClass) {
          throw new Error(`No existe el servicio ${model}`);
        }
        await serviceClass[operation](data);
        await db.runAsync('DELETE from pending_operation where id = $id', {
          $id: id,
        });
      }
      console.log('sync data');
      setHasPending((prev) => !prev);
      //await new Promise((resolve) => setTimeout(resolve, 2000));

      isSyncingRef.current = false;
      timeout = setTimeout(syncData, 10000);
    } catch (error) {
      console.log(error);
      isSyncingRef.current = false;
      timeout = setTimeout(syncData, 10000);
    }
  }, [db]);
  const refreshMasterData = useCallback(async () => {
    const _categories = await CategoryService.fetchAll();
    const _products = await ProductService.fetchAll();
    await AsyncStorageUtils.set('category', _categories);
    await AsyncStorageUtils.set('product', _products);
    setHasChangedData((prev) => !prev);
    //setProducts(_products);
    //setCategories(_categories);
  }, []);
  const registerPendingOperation = useCallback(
    async (model, operation, data) => {
      const jsonData = JSON.stringify(data);
      await db.runAsync(
        `INSERT INTO pending_operation (model, operation, data) VALUES (?, ?, ?)`,
        [model, operation, jsonData]
      );
    },
    [db]
  );
  const create = useCallback(
    async (table, _data) => {
      try {
        const { updatedImage, ...data } = _data;
        await AsyncStorageUtils.add(table, data);
        if (updatedImage) {
          const imageName = `${data.name.replaceAll(' ', '-')}_${Date.now()}.jpeg`;
          saveImage(table, data.image, imageName);
          data.image = imageName;
        }
        setHasChangedData((prev) => !prev);
        registerPendingOperation(table, 'save', data);
      } catch (error) {
        console.log(`Error on create ${table}`, error);
        throw error;
      }
    },
    [registerPendingOperation, saveImage]
  );
  const syncOrder = useCallback(
    async (data) => {
      try {
        const { lines, payments, ...ticket } = data;
        registerPendingOperation('order', 'save', ticket);
        registerPendingOperation('order', 'saveLines', lines);
        registerPendingOperation('order', 'savePayments', payments);
      } catch (error) {
        console.log(`Error on create order`, error);
        throw error;
      }
    },
    [registerPendingOperation]
  );

  const update = useCallback(
    async (table, _data) => {
      try {
        const { updatedImage, ...data } = _data;
        await AsyncStorageUtils.update(table, data);
        if (updatedImage) {
          const imageName = `${data.name.replaceAll(' ', '-')}_${Date.now()}.jpeg`;
          saveImage(table, data.image, imageName);
          data.image = imageName;
        }
        setHasChangedData((prev) => !prev);
        registerPendingOperation(table, 'save', data);
      } catch (error) {
        console.log(`Error on create ${table}`, error);
        throw error;
      }
    },
    [registerPendingOperation, saveImage]
  );
  const saveImage = useCallback(
    async (table, imageUri, imageName) => {
      try {
        registerPendingOperation(table, 'saveImage', { imageUri, imageName });
      } catch (error) {
        console.log(`Error on saveImage ${table}`, error);
        throw error;
      }
    },
    [registerPendingOperation]
  );
  const forceRefresh = useCallback(() => {
    setHasChangedData((prev) => !prev);
  }, []);
  const value = useCallback(
    () => ({
      create,
      syncOrder,
      update,
      refreshMasterData,
      syncData,
      hasChangedData,
      forceRefresh,
    }),
    [
      create,
      syncOrder,
      update,
      refreshMasterData,
      syncData,
      hasChangedData,
      forceRefresh,
    ]
  );
  return (
    <DataContext.Provider value={value}>
      <SyncContext.Provider value={hasPending}>{children}</SyncContext.Provider>
    </DataContext.Provider>
  );
}
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
