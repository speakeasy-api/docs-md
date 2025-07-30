"use client";

import { type PropsWithChildren, useMemo, useState } from "react";

import { useChildren } from "../../Section/hooks.ts";
import { TreeDataContext } from "../state.ts";
import styles from "../styles.module.css";
import type { TreeData, TreeNode } from "../types.ts";
import type { PrefixCellProps } from "./PrefixCells.tsx";

export type ExpandableSectionProps = PropsWithChildren;

export function ExpandableSectionContents({
  children,
}: ExpandableSectionProps) {
  const entries = useChildren<PrefixCellProps>(children, "entry");

  const [openNodes, setOpenNodes] = useState(new Set<string>());

  const treeData = useMemo(() => {
    const treeData: TreeData = {
      nodes: [],
      nodeMap: new Map(),
    };

    // Populate just the list of root nodes. We'll append children later
    for (const entry of entries) {
      if (entry.props.parentId === undefined) {
        const treeNode: TreeNode = {
          id: entry.props.id,
          parent: undefined,
          // Will be set later
          hasNextSibling: false,
          children: [],
        };
        treeData.nodeMap.set(entry.props.id, treeNode);
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const node = nodesToProcess[i]!;
        const parentNode =
          node.props.parentId && treeData.nodeMap.get(node.props.parentId);
        if (parentNode) {
          nodesToProcess.splice(i, 1);
          const treeNode: TreeNode = {
            id: node.props.id,
            parent: parentNode,
            // Will be set later
            hasNextSibling: false,
            children: [],
          };
          // Have to add the child backwards to preserve child order
          parentNode.children.unshift(treeNode);
          treeData.nodeMap.set(node.props.id, treeNode);
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

  return (
    <TreeDataContext.Provider
      value={{
        data: treeData,
        openNodes,
        setIsOpen: (id: string, isOpen: boolean) => {
          setOpenNodes((openNodes) => {
            const newOpenNodes = new Set(openNodes);
            if (isOpen) {
              newOpenNodes.add(id);
            } else {
              newOpenNodes.delete(id);
            }
            return newOpenNodes;
          });
        },
      }}
    >
      <div className={styles.treeTopper}>
        <div className={styles.treeTopperDot}></div>
      </div>
      {entries}
    </TreeDataContext.Provider>
  );
}
