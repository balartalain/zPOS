import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '@/src/context/dataContext';

const RefreshMasterDataScreen = () => {
  const router = useRouter();
  const { refreshMasterData } = useData();

  useEffect(() => {
    (async () => {
      await refreshMasterData();
      router.replace('(pos)');
    })();
  }, [refreshMasterData, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Actualizando Master Data...</Text>
    </View>
  );
};

export default RefreshMasterDataScreen;
