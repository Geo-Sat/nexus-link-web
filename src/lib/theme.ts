import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-storage',
    }
  )
)

// Initialize theme
if (typeof window !== 'undefined') {
  const theme = useTheme.getState().theme
  document.documentElement.classList.toggle('dark', theme === 'dark')

  useTheme.subscribe((state) => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
  })
}
