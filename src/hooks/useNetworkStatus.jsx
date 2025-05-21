import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

const CONNECTIVITY_CHECK_TIMEOUT = 3000;

export const checkInternetConnectivity = async () => {
  try {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONNECTIVITY_CHECK_TIMEOUT
    );

    try {
      await fetch('https://8.8.8.8', {
        method: 'HEAD',
        signal: controller.signal,
      });
      return true;
    } catch (error) {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    return false;
  }
};
let mounted = true;
let retryTimeout;
export default function useNetWorkStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const checkConnection = useCallback(async () => {
    try {
      const connected = await checkInternetConnectivity();
      ////console.log('checking conection... ', connected);
      setIsConnected(connected);
    } catch (error) {
      ////console.log('checking conection... ', false);
      setIsConnected(false);
    }
  }, []);
  useEffect(() => {
    mounted = true;
    (async () => {
      await infinityCheck();
    })();
    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [infinityCheck]);
  const infinityCheck = useCallback(async () => {
    if (!mounted) return;
    await checkConnection();
    retryTimeout = setTimeout(async () => await infinityCheck(), 5000);
  }, [checkConnection]);

  return isConnected;
}
