import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Edit from '@/src/components/editTemplate';
import CategoryService from '../../service/categoryService';
import { useIsFocused } from '@react-navigation/native';
import { useHeader } from '@/src/context/headerContext';

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
];
export { fields };
export default function CategoryEditScreen() {
  const isFocused = useIsFocused();
  const { setHeaderContent, setHeaderActions } = useHeader();

  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent('Editar la categoría');
      setHeaderActions(null);
    }
  }, [setHeaderContent, setHeaderActions, isFocused]);

  const { id } = useLocalSearchParams();
  return (
    <Edit
      fields={fields}
      table={'category'}
      serviceClass={CategoryService}
      id={id}
    />
  );
}
