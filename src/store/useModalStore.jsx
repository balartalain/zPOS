import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useModalStore = create((set, get) => ({
  label: '',
  isVisible: false,
  showModal: ({ label }) =>
    set((state) => ({
      isVisible: true,
      label,
    })),
  hideModal: () =>
    set((state) => ({
      isVisible: false,
      label: '',
    })),
}));

export default useModalStore;
