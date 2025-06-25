"use client";

import { atom } from "jotai";

export const dependenciesAtom = atom<Record<string, string> | null>(null);
export const lastEditorValueAtom = atom<string | null>(null);

export const setDependenciesAtom = atom(
  null,
  (get, set, dependencies: Record<string, string>, code: string) => {
    const previousDependencies = get(dependenciesAtom) || {};
    if (
      Object.keys(dependencies).join("-") !==
      Object.keys(previousDependencies).join("-")
    ) {
      set(dependenciesAtom, dependencies);
      set(lastEditorValueAtom, code);
    }
  }
);
