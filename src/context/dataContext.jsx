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
let timeout = null;
export function DataProvider({ children }) {
  const db = useSQLiteContext();
  const syncTimeoutRef = useRef(null);
  const isSyncingRef = useRef(false);
  const [refreshData, setRefreshData] = useState(false);
  const [updatePending, setUpdatePending] = useState(false);

  useEffect(() => {
    syncData();
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);
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
      const pending = await db.getAllAsync(
        'SELECT * FROM pending_operation ORDER BY created DESC'
      );
      for (const record of pending) {
        const { id, model, operation } = record;
        const data = JSON.parse(record.data);
        const serviceClass = ServiceRegistry.get(model);
        await serviceClass[operation](data);
        await db.runAsync('DELETE from pending_operation where id = $id', {
          $id: id,
        });
      }
      setUpdatePending((prev) => !prev);
      //await new Promise((resolve) => setTimeout(resolve, 2000));

      isSyncingRef.current = false;
      timeout = setTimeout(syncData, 10000);
    } catch (error) {
      console.log(error);
      isSyncingRef.current = false;
      timeout = setTimeout(syncData, 1000);
    } finally {
    }
  }, []);
  const refreshMasterData = useCallback(async () => {
    const _categories = await CategoryService.fetchAll();
    const _products = await ProductService.fetchAll();
    await AsyncStorageUtils.set('category', _categories);
    await AsyncStorageUtils.set('product', _products);
    setRefreshData((prev) => !prev);
    //setProducts(_products);
    //setCategories(_categories);
  }, []);
  const registerPendingOperation = useCallback(
    async (model, operation, data) => {
      console.log(data);
      const jsonData = JSON.stringify(data);
      await db.runAsync(
        `INSERT INTO pending_operation (model, operation, data) VALUES (?, ?, ?)`,
        [model, operation, jsonData]
      );
    },
    []
  );
  const create = useCallback(async (table, data) => {
    try {
      const serviceClass = ServiceRegistry.get(table);
      //await serviceClass.add(data);
      await AsyncStorageUtils.add(table, data);
      setRefreshData((prev) => !prev);
      registerPendingOperation(table, 'add', data);
    } catch (error) {
      console.log(`Error on create ${table}`, error);
      throw error;
    }
  }, []);
  const update = useCallback(async (table, data) => {
    try {
      await AsyncStorageUtils.update(table, data);
      setRefreshData((prev) => !prev);
      registerPendingOperation(table, 'update', data);
    } catch (error) {
      console.log(`Error on create ${table}`, error);
      throw error;
    }
  }, []);
  return (
    <DataContext.Provider
      value={{
        create,
        update,
        refreshMasterData,
        syncData,
        refreshData,
        updatePending,
        //forceSync,
        //isSyncing,
      }}
    >
      {children}
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
