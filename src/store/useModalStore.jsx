import { create } from 'zustand';

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
