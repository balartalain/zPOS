import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import Edit from '@/src/components/editTemplate';
import CategoryModel from '../../model/categoryModel';

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
export default function CategpryEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  return <Edit fields={fields} modelClass={CategoryModel} id={id} />;
}
