import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutConfig {
  navPosition: 'left' | 'top';
  direction: 'ltr' | 'rtl';
  setNavPosition: (position: 'left' | 'top') => void;
  setDirection: (direction: 'ltr' | 'rtl') => void;
}

export const useLayoutConfig = create<LayoutConfig>()(
  persist(
    (set) => ({
      navPosition: 'left',
      direction: 'ltr',
      setNavPosition: (position) => set({ navPosition: position }),
      setDirection: (direction) => set({ direction: direction }),
    }),
    {
      name: 'layout-config',
    }
  )
);
