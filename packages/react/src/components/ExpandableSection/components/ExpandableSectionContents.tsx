"use client";

import { useCallback, useState } from "react";

// eslint-disable-next-line fast-import/no-restricted-imports
import { ExpandableTreeTopper as DefaultExpandableTreeTopper } from "../../ExpandableTreeTopper/ExpandableTreeTopper.tsx";
import { OpenStateContext } from "../state.ts";
import type { ExpandableSectionProps } from "../types.ts";

export function ExpandableSectionContents({
  children,
  ExpandableTreeTopper = DefaultExpandableTreeTopper,
}: ExpandableSectionProps) {
  // TODO: add nodes with expandByDefault to openNodes
  const [openNodes, setOpenNodes] = useState(new Set<string>());

  const setIsOpen = useCallback((id: string, isOpen: boolean) => {
    setOpenNodes((openNodes) => {
      const newOpenNodes = new Set(openNodes);
      if (isOpen) {
        newOpenNodes.add(id);
      } else {
        newOpenNodes.delete(id);
      }
      return newOpenNodes;
    });
  }, []);

  return (
    <OpenStateContext.Provider
      value={{
        openNodes,
        setIsOpen,
      }}
    >
      <ExpandableTreeTopper />
      {children}
    </OpenStateContext.Provider>
  );
}
