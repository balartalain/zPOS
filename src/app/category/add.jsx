import React, { useEffect, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { fields } from './edit';
import Edit from '../../components/editTemplate';
import CategoryService from '../../service/categoryService';
import { useIsFocused } from '@react-navigation/native';
import { useHeader } from '@/src/context/headerContext';

export default function CategoryAddScreen() {
  const isFocused = useIsFocused();
  const { setHeaderContent, setHeaderActions } = useHeader();

  React.useEffect(() => {
    if (isFocused) {
      setHeaderContent('Adicionar una categoría');
      setHeaderActions(null);
    }
  }, [setHeaderContent, setHeaderActions, isFocused]);
  return (
    <Edit fields={fields} table={'category'} serviceClass={CategoryService} />
  );
}
