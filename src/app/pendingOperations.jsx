import React, { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useData } from '@/src/context/dataContext';

export default function PendingScreen() {
  const db = useSQLiteContext();
  const [pending, setPending] = useState([]);
  const { updatePending } = useData();
  useFocusEffect(
    React.useCallback(() => {
      getPending();
    }, [updatePending, getPending])
  );
  const getPending = React.useCallback(async () => {
    const pending = await db.getAllAsync(
      'SELECT * FROM pending_operation ORDER BY created DESC'
    );
    setPending(pending);
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
