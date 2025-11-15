import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'; // Using the new User type

export interface AuthState {
    user: User | null
    access: string | null
    refresh: string | null
    setUser: (user: User | null) => void
    setRefresh: (refresh: string | null) => void
    setAccess: (access: string | null) => void
    logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
        user: null,
        access: null,
        refresh: null,
        setUser: (user) => set({ user }),
        setRefresh: (refresh) => set({ refresh }),
        setAccess: (access) => set({ access }),
        logout: () => set({ user: null, access: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
