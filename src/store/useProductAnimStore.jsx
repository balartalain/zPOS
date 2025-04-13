import { create } from 'zustand';

const useProductAnimStore = create((set, get) => ({
  animate: false,
  from: { x: 0, y: 0 },
  to: { x: 0, y: 0 },
  hideAnim: () => set((state) => ({ animate: false })),
  runAnimation: ({ from, to }) =>
    set((state) => ({
      animate: true,
      from,
      to,
    })),
}));

export default useProductAnimStore;
