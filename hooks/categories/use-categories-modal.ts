import { create } from 'zustand';

// Interface for the categories modal state
interface CategoriesModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Custom hook to manage the state of the categories modal
 * Using Zustand for state management, which integrates well with TanStack Query
 */
export const useCategoriesModal = create<CategoriesModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
