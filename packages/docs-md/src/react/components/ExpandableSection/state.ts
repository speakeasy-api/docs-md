import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";

import { InternalError } from "../../../util/internalError.ts";
import { useChildren } from "../Section/hooks.ts";
import type { Connection, RowProps, TreeData, TreeNode } from "./types.ts";

type TreeDataContextType = {
  data: TreeData;

  // TODO: storing this at the root of the context means we re-render the entire
  // tree when it changes. If performance becomes an issue, we should consider
  // distributing open state via, I dunno maybe a Jotai atom family?
  openNodes: Set<string>;
  setIsOpen: (id: string, isOpen: boolean) => void;
};

export const TreeDataContext = createContext<TreeDataContextType | null>(null);

export function useTreeData(children: ReactNode) {
  const entries = useChildren<RowProps>(children, "entry");
  const treeData = useMemo(() => {
    const treeData: TreeData = {
      nodes: [],
      nodeMap: new Map(),
      headingIdToIdMap: new Map(),
    };

    // Populate the heading ID to node ID map
    for (const {
      props: { id, headingId },
    } of entries) {
      treeData.headingIdToIdMap.set(headingId, id);
    }

    // Populate just the list of root nodes. We'll append children later
    for (const {
      props: { id, parentId, headingId },
    } of entries) {
      if (parentId === undefined) {
        const treeNode: TreeNode = {
          id,
          headingId,
          parent: undefined,
          children: [],

          // Will be set later
          hasNextSibling: false,
        };
        treeData.nodeMap.set(id, treeNode);
        treeData.nodes.push(treeNode);
      }
    }

    // Once we've populated the list, we set next-sibling relationships. Logic
    // is different (and simpler) at the root level, so we handle it now.
    for (let i = 0; i < treeData.nodes.length - 1; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      treeData.nodes[i]!.hasNextSibling = true;
    }

    // Create a list of nodes to process, aka nodes that have not been added
    // to the tree yet
    const nodesToProcess = entries.filter(
      (entry) => entry.props.parentId !== undefined
    );

    // We keep looping until there's nothing left to process. With each
    // iteration, we attach nodes to their parents, if they've already been
    // added to tree data, and remove them from the list of nodes to process.
    // In practice, this means we process nodes in top-down order.
    while (nodesToProcess.length > 0) {
      // Iterate backwards so mutations don't throw off looping
      for (let i = nodesToProcess.length - 1; i >= 0; i--) {
        const {
          props: { id, parentId, headingId },
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        } = nodesToProcess[i]!;
        const parentNode = parentId && treeData.nodeMap.get(parentId);
        if (parentNode) {
          nodesToProcess.splice(i, 1);
          const treeNode: TreeNode = {
            id,
            headingId,
            parent: parentNode,
            children: [],

            // Will be set later
            hasNextSibling: false,
          };
          // Have to add the child backwards to preserve child order
          parentNode.children.unshift(treeNode);
          treeData.nodeMap.set(id, treeNode);
        }
      }
    }

    // Set next-sibling relationships for non-root nodes. We start by
    const stack = treeData.nodes.filter((node) => node.parent === undefined);
    while (true) {
      const currentParent = stack.pop();
      if (!currentParent) {
        break;
      }
      if (currentParent.children.length === 0) {
        continue;
      }
      for (let i = 0; i < currentParent.children.length - 1; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const child = currentParent.children[i]!;
        child.hasNextSibling = true;
        stack.push(child);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stack.push(currentParent.children.at(-1)!);
    }

    return treeData;
  }, [entries]);

  return { treeData, entries };
}

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

function isOpen(context: TreeDataContextType, id: string) {
  if (context === null) {
    throw new InternalError("TreeData context is not initialized");
  }

  const node = context.data.nodeMap.get(id);
  if (!node) {
    throw new InternalError(`Node with id ${id} not found in tree data`);
  }

  return context.openNodes.has(id);
}

export function useIsOpen(id: string) {
  const context = useContext(TreeDataContext);
  if (context === null) {
    throw new InternalError("TreeData context is not initialized");
  }
  return [
    isOpen(context, id),
    (isOpen: boolean) => context.setIsOpen(id, isOpen),
  ] as const;
}

export function useOpenNodeByHash() {
  const context = useContext(TreeDataContext);
  if (context === null) {
    throw new InternalError("TreeData context is not initialized");
  }

  // We need a stable callback, but with an up to date context, so we stick it
  // in a ref and reference it indirectly
  const contextRef = useRef(context);
  contextRef.current = context;
  return useCallback((hash: string) => {
    const context = contextRef.current;
    // Since we call setState indirectly from this function, we have to defer
    // calling setState until the next tick. Otherwise we'll get a "cannot set
    // state during render" error.
    setTimeout(() => {
      const nodeId = context.data.headingIdToIdMap.get(hash);
      if (!nodeId) {
        // If we don't have a node ID, then this hash corresponds with a heading
        // outside of the expandable section. We do nothing in this case.
        return;
      }

      // If we're already open, we don't need to do anything so we bail early.
      // This is especially important because we don't want to scroll to this
      // element if it's already open and disrupt someone's reading flow.
      if (isOpen(context, nodeId)) {
        return;
      }

      let node = context.data.nodeMap.get(nodeId);
      if (!node) {
        throw new InternalError(
          `Node with id ${nodeId} not found in tree data`
        );
      }

      while (node) {
        context.setIsOpen(node.id, true);
        node = node.parent;
      }

      // Scroll to the element, after giving React a chance to re-render
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        // TODO: we should base this on React's rendering state, not a timeout
      }, 250);
    });
  }, []);
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
