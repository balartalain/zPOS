import React, { useEffect, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { fields } from './edit';
import Edit from '../../components/editTemplate';
import ProductService from '../../service/productService';

export default function ProductAddScreen() {
  const router = useRouter();
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        //router.replace('/(crud)');
      })();
    }, [])
  );

  return (
    <Edit fields={fields} table={'product'} serviceClass={ProductService} />
  );
}
