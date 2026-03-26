import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (credentials) => {
        const response = await authService.login(credentials);
        if (response.success) {
          localStorage.setItem('hireos_token', response.data.token);
          set({ user: response.data.user, token: response.data.token, isAuthenticated: true });
          return response.data.user;
        }
        throw new Error(response.message || 'Login failed');
      },
      register: async (data) => {
        const response = await authService.register(data);
        if (response.success) {
          localStorage.setItem('hireos_token', response.data.token);
          set({ user: response.data.user, token: response.data.token, isAuthenticated: true });
          return response.data.user;
        }
        throw new Error(response.message || 'Registration failed');
      },
      logout: () => {
        localStorage.removeItem('hireos_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
      isRecruiter: () => ['recruiter','admin'].includes(get().user?.role),
      isCandidate: () => get().user?.role === 'candidate',
    }),
    { name: 'hireos-auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);
