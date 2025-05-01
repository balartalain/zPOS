import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import Edit from '@/src/components/editTemplate';
import CategoryService from '../../service/categoryService';

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
];
export { fields };
export default function CategoryEditScreen() {
  const router = useRouter();
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
