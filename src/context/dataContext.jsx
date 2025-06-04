import { useSQLiteContext } from 'expo-sqlite';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { AppState } from 'react-native';
import {
  ServiceRegistry,
  CategoryService,
  ProductService,
} from '@/src/service';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';
import { eventBus, eventName } from '@/src/event/eventBus';
import useWhyDidYouUpdate from '@/src/hooks/useWhyDidYouUpdate';
import { useAuth } from './userContext';

const DataContext = createContext(null);
const SyncContext = createContext(null);
//const SYNCING_TIMEOUT = 5000;

export function DataProvider({ children }) {
  const db = useSQLiteContext();
  const { user, isProfileActive, isConnected, getSession } = useAuth();
  const pendingRef = useRef(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasPendingOperations, setHasPendingOperations] = useState(false);
  // useWhyDidYouUpdate(
  //   'Data Context',
  //   { children },
  //   { db, syncTimeoutRef, isSyncing }
  // );
  useEffect(() => {
    eventBus.on(eventName.SYNC_ORDER, syncOrder);
  }, [syncOrder]);
  useEffect(() => {
    (async () => {
      if (isConnected) {
        const session = await getSession();
        const profileActive = isProfileActive(user?.id);
        if (hasPendingOperations && isConnected && session && profileActive) {
          await syncData();
        }
      }
    })();
  }, [
    user?.id,
    hasPendingOperations,
    isConnected,
    getSession,
    syncData,
    isProfileActive,
  ]);

  useEffect(() => {
    (async () => {
      const pending = await getPendingOperations();
      if (pending.length > 0) {
        setHasPendingOperations(true);
        //syncTimeoutRef.current = setTimeout(async () => await syncLoop(), 1000);
      } else {
        setHasPendingOperations(false);
      }
    })();
    AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        const pending = await getPendingOperations();
        if (pending.length > 0) {
          setHasPendingOperations(true);
        } else {
          setHasPendingOperations(false);
        }
      }
    });
  }, [db, getPendingOperations, setHasPendingOperations]);

  const getPendingOperations = useCallback(async () => {
    const pending = await db.getAllAsync(
      'SELECT * FROM pending_operation ORDER BY created ASC'
    );
    return pending;
  }, [db]);
  const loadCategories = React.useCallback(async () => {
    const categories = await AsyncStorageUtils.findAll('category');
    return categories;
  }, []);
  const loadProducts = React.useCallback(async () => {
    const products = await AsyncStorageUtils.findAll('product');
    return products;
  }, []);
  const syncData = useCallback(async () => {
    try {
      const pending = await getPendingOperations();
      if (pending.length > 0) {
        setIsSyncing(true);
        //console.log('is syncing true');
        for (const record of pending) {
          const { id, model, operation } = record;
          try {
            const data = JSON.parse(record.data);
            const serviceClass = ServiceRegistry.get(model);
            if (!serviceClass) {
              throw new Error(`No existe el servicio ${model}`);
            }
            await serviceClass[operation](data);
          } catch (error) {
            console.log(error);
            if (error?.code === '23505') {
              // duplicate key value violates.
              // Ignore
            } else if (
              error?.code === 'session_expired' ||
              error?.code == '42501'
            ) {
              //code == '42501': new row violates row-level security policy
              // Handle session expired error
              throw new Error('Session expired...');
            } else {
              throw error;
            }
          }
          await db.runAsync('DELETE from pending_operation where id = $id', {
            $id: id,
          });
        }
      } else {
        //setHasPendingOperations(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setHasPendingOperations(false);
      setIsSyncing(false);
    }
  }, [db, getPendingOperations]);

  const refreshMasterData = useCallback(async () => {
    const _categories = await CategoryService.fetchAll();
    const _products = await ProductService.fetchAll();
    await AsyncStorageUtils.set('category', _categories);
    await AsyncStorageUtils.set('product', _products);
  }, []);
  const registerPendingOperation = useCallback(
    async (model, operation, data) => {
      const jsonData = JSON.stringify(data);
      await db.runAsync(
        `INSERT INTO pending_operation (model, operation, data) VALUES (?, ?, ?)`,
        [model, operation, jsonData]
      );
      pendingRef.current = true;
      setHasPendingOperations(true);
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
  const value = React.useMemo(
    () => ({
      loadProducts,
      loadCategories,
      create,
      update,
      syncOrder,
      refreshMasterData,
      hasPendingOperations,
    }),
    [
      create,
      syncOrder,
      update,
      refreshMasterData,
      loadProducts,
      loadCategories,
      hasPendingOperations,
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
