import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...userData } : null 
      })),
    }),
    {
      name: 'culturapp-auth',
    }
  )
);

// Role-based access control helpers
export const hasRole = (user: User | null, allowedRoles: User['role'][]) => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const isAdmin = (user: User | null) => hasRole(user, ['admin']);
export const isOrganizer = (user: User | null) => hasRole(user, ['organizer', 'admin']);
export const isParticipant = (user: User | null) => hasRole(user, ['participant']);
