import { atom } from "jotai";

type EmbedContent = {
  title: string;
  content: React.ReactNode;
};

export const embedContentAtom = atom<EmbedContent | null>(null);
