import { atom } from "jotai";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};

export const sidebarContentAtom = atom<SidebarContent | null>(null);
