"use client";

import { atom } from "jotai";

export const sidebarContentAtom = atom<{
  title: string;
  content: React.ReactNode;
} | null>(null);
