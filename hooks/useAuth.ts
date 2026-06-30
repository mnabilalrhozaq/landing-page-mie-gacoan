"use client";

import { create } from "zustand";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface AuthStore {
  admin: Admin | null;
  isLoading: boolean;
  setAdmin: (admin: Admin | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
}

export const useAuth = create<AuthStore>((set) => ({
  admin: null,
  isLoading: true,
  setAdmin: (admin) => set({ admin }),
  setIsLoading: (isLoading) => set({ isLoading }),
  checkAuth: async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      if (res.ok) {
        const adminData = await res.json();
        set({ admin: adminData });
      } else {
        set({ admin: null });
      }
    } catch (err) {
      set({ admin: null });
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email, password) => {
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login gagal");
    }
    
    const data = await res.json();
    set({ admin: data.admin });
  },
  logout: async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    set({ admin: null });
  },
  refresh: async () => {
    try {
      const res = await fetch("/api/admin/auth/refresh", { method: "POST" });
      return res.ok;
    } catch {
      return false;
    }
  },
}));
