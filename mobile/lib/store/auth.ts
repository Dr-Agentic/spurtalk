import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { User } from "@spurtalk/shared";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

// Custom storage adapter for Zustand to use Expo SecureStore
const secureStorage = {
  getItem: async (name: string) => {
    return (await SecureStore.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken });
        SecureStore.setItemAsync("refreshToken", refreshToken);
      },
      logout: () => {
        set({ user: null, accessToken: null });
        SecureStore.deleteItemAsync("refreshToken");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
