import React, { useEffect, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { fields } from './edit';
import Edit from '../../components/editTemplate';
import ProductService from '../../service/productService';
import { useHeader } from '@/src/context/headerContext';

export default function ProductAddScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { setHeaderContent, setHeaderActions } = useHeader();

  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent('Editar el artículo');
      setHeaderActions(null);
    }
  }, [setHeaderContent, setHeaderActions, isFocused]);

  return (
    <Edit fields={fields} table={'product'} serviceClass={ProductService} />
  );
}
