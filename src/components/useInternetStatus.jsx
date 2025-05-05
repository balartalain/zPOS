import { useState, useEffect } from 'react';

export default function useInternetStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkInternetAccess = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000000);
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos/1',
          { method: 'GET', signal: controller.signal }
        );
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      } finally {
        clearTimeout(timer);
        //setTimeout
      }
    };

    // Run initial check
    checkInternetAccess();
    // Periodically check internet access every 10 seconds
    const interval = setInterval(checkInternetAccess, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return isConnected;
}
