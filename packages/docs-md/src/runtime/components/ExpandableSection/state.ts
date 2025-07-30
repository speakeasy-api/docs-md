import { createContext, useContext } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type { Connection, TreeData } from "./types.ts";

export const TreeDataContext = createContext<{
  data: TreeData;

  // TODO: storing this at the root of the context means we re-render the entire
  // tree when it changes. If performance becomes an issue, we should consider
  // distributing open state via, I dunno maybe a Jotai atom family?
  openNodes: Set<string>;
  setIsOpen: (id: string, isOpen: boolean) => void;
} | null>(null);

export function useConnectingCellData(id: string) {
  const context = useContext(TreeDataContext);
  if (context === null) {
    throw new InternalError("TreeData context is not initialized");
  }

  const connections: Pick<Connection, "bottom" | "top" | "right">[] = [];

  let node = context.data.nodeMap.get(id);
  if (!node) {
    throw new InternalError(`Node with id ${id} not found in tree data`);
  }

  // The right-most connection is unique, because it connects to the expandable
  // node and so always has a top and right connection. It's also always
  // guaranteed to exist. We handle it separately here.
  connections.push({
    bottom: node.hasNextSibling ? "connected" : "none",
    top: "connected",
    right: "connected",
  });

  // Now we process any more connections that may or may not exist
  node = node.parent;
  while (node) {
    connections.unshift({
      bottom: node.hasNextSibling ? "connected" : "none",
      top: node.hasNextSibling ? "connected" : "none",
      right: "none",
    });
    node = node.parent;
  }

  return connections;
}

export function useIsOpen(id: string) {
  const context = useContext(TreeDataContext);
  if (context === null) {
    throw new InternalError("TreeData context is not initialized");
  }

  const node = context.data.nodeMap.get(id);
  if (!node) {
    throw new InternalError(`Node with id ${id} not found in tree data`);
  }

  return [
    context.openNodes.has(id),
    (isOpen: boolean) => context.setIsOpen(id, isOpen),
  ] as const;
}

export function useAreAllParentsOpen(id: string) {
  const context = useContext(TreeDataContext);
  if (context === null) {
    throw new InternalError("TreeData context is not initialized");
  }

  const node = context.data.nodeMap.get(id);
  if (!node) {
    throw new InternalError(`Node with id ${id} not found in tree data`);
  }

  let currentParent = node.parent;

  // Root nodes are always open
  if (!currentParent) {
    return true;
  }

  while (currentParent) {
    if (!context.openNodes.has(currentParent.id)) {
      return false;
    }
    currentParent = currentParent.parent;
  }

  return true;
}

export function useHasChildren(id: string) {
  const context = useContext(TreeDataContext);
  if (context === null) {
    throw new InternalError("TreeData context is not initialized");
  }

  const node = context.data.nodeMap.get(id);
  if (!node) {
    throw new InternalError(`Node with id ${id} not found in tree data`);
  }

  return node.children.length > 0;
}
