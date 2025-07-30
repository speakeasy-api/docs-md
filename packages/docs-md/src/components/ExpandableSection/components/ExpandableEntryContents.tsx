"use client";

import { type PropsWithChildren } from "react";

import {
  useAreAllParentsOpen,
  useConnectingCellData,
  useHasChildren,
  useIsOpen,
} from "../state.ts";
import styles from "../styles.module.css";
import { ConnectingCell } from "./ConnectingCell.tsx";
import { ContentCell } from "./ContentCell.tsx";
import { ExpandableCell } from "./ExpandableCell.tsx";
import { NonExpandableCell } from "./NonExpandableCell.tsx";

export type ExpandableEntryProps = PropsWithChildren<{
  id: string;

  // Used by ExpandableSectionContents to build the tree
  parentId?: string;
  slot: "entry";
}>;

export function ExpandableEntryContents({
  id,
  slot,
  children,
}: ExpandableEntryProps) {
  // TODO: these need to use id paths, not just id
  const [isOpen, setIsOpen] = useIsOpen(id);
  const isParentOpen = useAreAllParentsOpen(id);
  const connections = useConnectingCellData(id);
  const hasChildren = useHasChildren(id);
  const isExpandable = hasChildren && children;

  if (!isParentOpen) {
    return null;
  }

  return (
    <div slot={slot} className={styles.expandableEntry}>
      {connections.map((cellData, index) => (
        <ConnectingCell
          key={index}
          bottom={cellData.bottom}
          top={cellData.top}
          right={cellData.right}
        />
      ))}
      {isExpandable ? (
        <ExpandableCell isOpen={isOpen} setIsOpen={setIsOpen} />
      ) : (
        <NonExpandableCell />
      )}
      <ContentCell isOpen={isOpen}>{children}</ContentCell>
    </div>
  );
}
