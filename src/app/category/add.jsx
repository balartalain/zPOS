import React, { useEffect, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { fields } from './edit';
import Edit from '../../components/editTemplate';
import CategoryService from '../../service/categoryService';

export default function CategoryAddScreen() {
  const router = useRouter();
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        //router.replace('/(crud)');
      })();
    }, [])
  );

  return (
    <Edit fields={fields} table={'category'} serviceClass={CategoryService} />
  );
}
