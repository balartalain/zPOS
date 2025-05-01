import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, findNodeHandle } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import ProductModel from '@/src/model/productModel';
import Edit from '@/src/components/editTemplate';

const fields = [
  {
    column: 'objectId',
    label: 'objectId',
    type: 'string',
    required: true,
    hidden: true,
  },
  {
    column: 'name',
    label: 'Nombre',
    type: 'string',
    required: true,
  },
  {
    column: 'category',
    label: 'Categoría',
    type: 'reference',
    required: false,
  },
  {
    column: 'price',
    label: 'Precio',
    type: 'numeric',
    required: true,
  },
  {
    column: 'cost',
    label: 'Precio de compra',
    type: 'numeric',
    required: true,
  },
  {
    column: 'inStock',
    label: 'En Stock',
    type: 'numeric',
    required: true,
  },
  {
    column: 'image',
    label: 'Imagen',
    type: 'image',
    required: false,
  },
];
export { fields };
export default function ProductEditScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams();
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        //router.replace('/(crud)');
      })();
    }, [])
  );
  return <Edit fields={fields} modelClass={ProductModel} id={id} />;
}
