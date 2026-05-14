import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => void;
  register: (email: string, _password: string, username?: string) => void;
  logout: () => void;
  loginWithGoogle: () => void;
}

const mockUser: User = {
  id: "u-001",
  email: "minh.nguyen@vilearn.vn",
  username: "minhnguyen",
  firstName: "Minh",
  lastName: "Nguyễn",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=minhnguyen",
  role: "teacher",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  accessToken: "mock-jwt-token",
  isAuthenticated: true,
  login: (email) =>
    set({
      user: { ...mockUser, email },
      accessToken: "mock-jwt-token",
      isAuthenticated: true,
    }),
  register: (email, _password, username) =>
    set({
      user: { ...mockUser, email, username: username ?? mockUser.username },
      accessToken: "mock-jwt-token",
      isAuthenticated: true,
    }),
  logout: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
  loginWithGoogle: () =>
    set({
      user: mockUser,
      accessToken: "mock-jwt-token",
      isAuthenticated: true,
    }),
}));
