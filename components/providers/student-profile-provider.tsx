"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { categoryMeta } from "@/lib/constants";
import { users } from "@/lib/data/kfupm-data";
import type { User, UserCategory } from "@/lib/types";

type StudentProfileContextValue = {
  user: User;
  selectCategory: (category: UserCategory) => void;
  updateUser: (updates: Partial<User>) => void;
};

const StudentProfileContext = createContext<StudentProfileContextValue | null>(null);
const storageKey = "kfupm-parksense-student";

function getTemplateUser(category: UserCategory) {
  return users.find((user) => user.userCategory === category && user.role === "student") ?? users[1];
}

function readStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => users[1]);

  useEffect(() => {
    const stored = readStoredUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(user));

    const theme = categoryMeta[user.userCategory];
    const root = document.documentElement;
    root.style.setProperty("--category-primary", theme.primary);
    root.style.setProperty("--category-soft", theme.soft);
    root.style.setProperty("--category-border", theme.border);
    root.style.setProperty("--category-text", theme.text);
  }, [user]);

  const value = useMemo<StudentProfileContextValue>(
    () => ({
      user,
      selectCategory: (category) => {
        const template = getTemplateUser(category);
        setUser((current) => ({
          ...current,
          gender: template.gender,
          residencyStatus: template.residencyStatus,
          userCategory: template.userCategory,
          role: template.role,
          passwordHash: current.passwordHash || template.passwordHash,
          notificationSettings: current.notificationSettings,
          updatedAt: template.updatedAt
        }));
      },
      updateUser: (updates) => {
        setUser((current) => ({ ...current, ...updates }));
      }
    }),
    [user]
  );

  return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>;
}

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);
  if (!context) {
    throw new Error("useStudentProfile must be used within StudentProfileProvider");
  }

  return context;
}
