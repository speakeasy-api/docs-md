import { createContext, useContext } from "react";

import { InternalError } from "../../util/internalError.ts";
import type { Connection, TreeData } from "./types.ts";

export const TreeDataContext = createContext<TreeData | null>(null);

export function useConnectingCellData(id: string) {
  const data = useContext(TreeDataContext);
  if (data === null) {
    throw new InternalError("TreeData context is not initialized");
  }

  const connections: Pick<Connection, "bottom" | "top" | "right">[] = [];

  let node = data.nodeMap.get(id);
  if (!node) {
    throw new InternalError(`Node with id ${id} not found in tree data`);
  }
  const hasChildren = node.children.length > 0;

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

  return { connections, hasChildren };
}
