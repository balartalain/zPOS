import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, findNodeHandle } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import ProductService from '../../service/productService';
import { useHeader } from '@/src/context/headerContext';
import Edit from '@/src/components/editTemplate';

const fields = [
  {
    column: 'id',
    label: 'id',
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
    column: 'category_id',
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
    column: 'in_stock',
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
  const isFocused = useIsFocused();
  const { setHeaderContent, setHeaderActions } = useHeader();

  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent('Editar el artículo');
      setHeaderActions(null);
    }
  }, [setHeaderContent, setHeaderActions, isFocused]);

  const { id } = useLocalSearchParams();

  return (
    <Edit
      fields={fields}
      table={'product'}
      serviceClass={ProductService}
      id={id}
    />
  );
}
