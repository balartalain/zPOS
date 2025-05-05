import { useState, useEffect } from 'react';

export default function useNetWorkStatus() {
  const [hasInternet, setHasInternet] = useState(false);

  useEffect(() => {
    const checkInternetAccess = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos/1',
          {
            method: 'HEAD',
            signal: controller.signal,
          }
        );
        setHasInternet(response.ok);
      } catch {
        setHasInternet(false);
      } finally {
        clearTimeout(timer);
        setTimeout(checkInternetAccess, 10000);
      }
    };

    // Ejecuta la verificación inicial
    checkInternetAccess();
    return () => {};
  }, []);

  return hasInternet;
}
