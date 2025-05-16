import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useSync } from '@/src/context/dataContext';

export default function PendingScreen() {
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const [pending, setPending] = useState([]);
  const executedSynchronization = useSync();
  React.useEffect(() => {
    if (isFocused) {
      console.log('pending operations', executedSynchronization);
      getPending();
    }
  }, [getPending, executedSynchronization, isFocused]);

  const getPending = React.useCallback(async () => {
    const _pending = await db.getAllAsync(
      'SELECT * FROM pending_operation ORDER BY created DESC'
    );
    setPending(_pending);
  }, [db]);
  return (
    <View>
      <FlatList
        data={pending}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <View>
            <Text>{`${item.model} - ${item.operation} - ${item.created}`}</Text>
          </View>
        )}
      />
    </View>
  );
}
