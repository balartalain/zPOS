import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Edit from '@/src/components/editTemplate';
import CategoryService from '../../service/categoryService';

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
