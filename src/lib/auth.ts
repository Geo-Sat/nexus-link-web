import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'; // Using the new User type

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      // For development, setting an initial user
      user: {
        id: 1,
        name: 'Admin User',
        username: 'admin',
        role: 'admin',
      },
      token: 'demo-token',
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
