"use client";

import { type PropsWithChildren } from "react";

import {
  useAreAllParentsOpen,
  useConnectingCellData,
  useIsOpen,
} from "../state.ts";
import styles from "../styles.module.css";
import { ConnectingCell } from "./ConnectingCell.tsx";
import { ContentCell } from "./ContentCell.tsx";
import { ExpandableCell } from "./ExpandableCell.tsx";

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
  const [isOpen, setIsOpen] = useIsOpen(id);
  const isParentOpen = useAreAllParentsOpen(id);
  const { connections, hasChildren } = useConnectingCellData(id);

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
      <ExpandableCell
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        bottom={hasChildren && isOpen ? "connected" : "none"}
        left="connected"
      />
      <ContentCell isOpen={isOpen}>{children}</ContentCell>
    </div>
  );
}
