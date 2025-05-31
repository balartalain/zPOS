import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { getHeaderTitle } from '@react-navigation/elements';
import {
  Button,
  Text,
  Surface,
  useTheme,
  Badge,
  Appbar,
} from 'react-native-paper';
import { ApprovalProvider } from '../../components/approvalContext';
import useTicketStore from '@/src/store/useTicketStore';

//import useNetworkStatus from '@/src/hooks/useNetworkStatus';

// function AppBar(props) {
//   const nav = useNavigation();
//   const { navigation, route, options, back } = props;
//   const title = getHeaderTitle(options, route.name);
//   return (
//     <Appbar.Header>
//       {back ? (
//         <Appbar.BackAction onPress={navigation.goBack} />
//       ) : (
//         <Appbar.Action
//           icon="menu"
//           onPress={() => nav.dispatch(DrawerActions.openDrawer())}
//         />
//       )}
//       <Appbar.Content title={title} />
//     </Appbar.Header>
//   );
// }
const StacksLayout = () => {
  const router = useRouter();
  const nav = useNavigation();
  const theme = useTheme();
  const { sales, completeTicket, markSaleAsSynced } = useTicketStore();
  //const isConnected = useNetworkStatus();
  ////console.log('POS is online: ', isConnected);
  return (
    <ApprovalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          // options={{
          //   headerTitle: 'Nueva Venta',
          // }}
        />
        <Stack.Screen
          name="shoppingCart"
          options={{
            headerTitle: 'En la cesta',
          }}
        />
        <Stack.Screen name="addPayments" />
      </Stack>
    </ApprovalProvider>
  );
};

export default StacksLayout;
