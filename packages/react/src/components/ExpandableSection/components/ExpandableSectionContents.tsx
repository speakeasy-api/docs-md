"use client";

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

import { TreeDataContext, useOpenNodeByHash, useTreeData } from "../state.ts";
import styles from "../styles.module.css";
import type { ExpandableSectionProps } from "../types.ts";

function HashChangeManager({ children }: PropsWithChildren) {
  const openNode = useOpenNodeByHash();

  // Set all appropriate nodes as open when the hash changes or is set on load
  useEffect(() => {
    function handleHashChange() {
      if (!window.location.hash) {
        return;
      }
      const hash = window.location.hash.slice(1); // Remove the '#'
      openNode(hash);
    }

    // Check initial hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [openNode]);

  return children;
}

export function ExpandableSectionContents({
  children,
}: ExpandableSectionProps) {
  const { treeData, entries } = useTreeData(children);
  const [openNodes, setOpenNodes] = useState(
    new Set<string>(
      treeData.nodes
        .filter((node) => {
          if (node.parent) {
            return false;
          }
          const entry = entries.find((entry) => entry.props.id === node.id);
          return !!entry?.props.expandByDefault;
        })
        .map((node) => node.id)
    )
  );

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
    <TreeDataContext.Provider
      value={{
        data: treeData,
        openNodes,
        setIsOpen,
      }}
    >
      <HashChangeManager>
        <div className={styles.treeTopper}>
          <div className={styles.treeTopperDot}></div>
        </div>
        {entries}
      </HashChangeManager>
    </TreeDataContext.Provider>
  );
}
