import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import type { User, DecodedToken } from "../types";
import { queryClient } from "../main";

// Token storage key - consistent with apiService.ts
const TOKEN_KEY = "authToken";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Helper function to get initial state from localStorage
 */
const getInitialState = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      // Check if token is not expired
      if (decodedToken.exp * 1000 > Date.now()) {
        const user: User = {
          username: decodedToken.sub,
          role: decodedToken.role,
        };
        return {
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        };
      } else {
        // Token expired, remove it
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error("Error decoding token on initial load:", error);
      localStorage.removeItem(TOKEN_KEY);
    }
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  login: (token: string) => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      // Check if token is valid and not expired
      if (decodedToken.exp * 1000 <= Date.now()) {
        throw new Error("Token is expired");
      }

      const user: User = {
        username: decodedToken.sub,
        role: decodedToken.role,
      };

      localStorage.setItem(TOKEN_KEY, token);
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to decode token during login:", error);
      localStorage.removeItem(TOKEN_KEY);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.clear();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initializeAuth: () => {
    set(getInitialState());
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
