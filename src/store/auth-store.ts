import { create } from "zustand";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setUser: (user: User, accessToken: string) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user: User, accessToken: string) => {
    set({ user, accessToken });
  },

  clearUser: () => {
    set({ user: null, accessToken: null });
  },
}));