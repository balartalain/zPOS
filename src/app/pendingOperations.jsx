import React, { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default PendingScreen = () => {
  const db = useSQLiteContext();
  const [pending, setPending] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      getPending();
    }, [])
  );
  const getPending = React.useCallback(async () => {
    const pending = await db.getAllAsync(
      'SELECT * FROM pending_operation ORDER BY created DESC'
    );
    console.log(pending);
    setPending(pending);
  }, [db]);
  return (
    <View>
      <FlatList
        data={pending}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{`ID: ${item.id} - ${item.model} - ${item.operation} - ${item.created}`}</Text>
          </View>
        )}
      />
    </View>
  );
};
