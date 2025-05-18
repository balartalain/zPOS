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
import { checkInternetConnectivity } from '../hooks/useNetworkStatus';

const DataContext = createContext(null);
const SyncContext = createContext(null);
const SYNCING_TIMEOUT = 10000;
export function DataProvider({ children }) {
  const db = useSQLiteContext();
  const syncTimeoutRef = useRef(null);
  const [isUpdatedMasterData, setIsUpdatedMasterData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  //const isConnected = useNetWorkStatus();
  useEffect(() => {
    (async () => {
      syncTimeoutRef.current = setTimeout(async () => await syncLoop(), 1000);
    })();
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [syncLoop]);
  const syncLoop = useCallback(async () => {
    try {
      const isConnected = await checkInternetConnectivity();
      if (isConnected) {
        console.log('Online');
        await syncData();
      } else {
        console.log('Offline');
      }
    } finally {
      syncTimeoutRef.current = setTimeout(
        async () => await syncLoop(),
        SYNCING_TIMEOUT
      );
    }
  }, [syncData]);

  const syncData = useCallback(async () => {
    try {
      //await db.runAsync('DELETE from pending_operation');
      const pending = await db.getAllAsync(
        'SELECT * FROM pending_operation ORDER BY created ASC'
      );
      if (pending.length > 0) {
        setIsSyncing(true);
        console.log('is syncing true');
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log('is syncing false');
      setIsSyncing(false);
    }
  }, [db]);
  const refreshMasterData = useCallback(async () => {
    const _categories = await CategoryService.fetchAll();
    const _products = await ProductService.fetchAll();
    await AsyncStorageUtils.set('category', _categories);
    await AsyncStorageUtils.set('product', _products);
    setIsUpdatedMasterData((prev) => !prev);
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
        setIsUpdatedMasterData((prev) => !prev);
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
        setIsUpdatedMasterData((prev) => !prev);
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
    console.log('force refresh');
    setIsUpdatedMasterData((prev) => !prev);
  }, []);
  const value = React.useMemo(
    () => ({
      create,
      syncOrder,
      update,
      refreshMasterData,
      isUpdatedMasterData,
      forceRefresh,
    }),
    [
      create,
      syncOrder,
      update,
      refreshMasterData,
      isUpdatedMasterData,
      forceRefresh,
    ]
  );
  return (
    <DataContext.Provider value={value}>
      <SyncContext.Provider value={isSyncing}>{children}</SyncContext.Provider>
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
export function useSync() {
  const context = useContext(SyncContext);
  return context;
}
