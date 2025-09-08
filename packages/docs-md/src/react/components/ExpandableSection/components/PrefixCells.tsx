"use client";

import type { FC } from "react";
import { type PropsWithChildren } from "react";

import type { ConnectingCellProps } from "../../ConnectingCell/types.ts";
import type { ExpandableCellProps } from "../../ExpandableCell/types.ts";
import type { NonExpandableCellProps } from "../../NonExpandableCell/types.ts";
import {
  useAreAllParentsOpen,
  useConnectingCellData,
  useHasChildren,
  useIsOpen,
} from "../state.ts";
import styles from "../styles.module.css";

type PrefixCellProps = PropsWithChildren<{
  id: string;
  variant: "circle" | "square";
  slot: "entry";
  hasFrontMatter: boolean;
  ExpandableCell: FC<ExpandableCellProps>;
  NonExpandableCell: FC<NonExpandableCellProps>;
  ConnectingCell: FC<ConnectingCellProps>;
}>;

export function PrefixCells({
  id,
  slot,
  children,
  variant,
  hasFrontMatter,
  ExpandableCell,
  NonExpandableCell,
  ConnectingCell,
}: PrefixCellProps) {
  // TODO: these need to use id paths, not just id
  const [isOpen, setIsOpen] = useIsOpen(id);
  const isParentOpen = useAreAllParentsOpen(id);
  const connections = useConnectingCellData(id);
  const hasChildren = useHasChildren(id);
  const isExpandable = hasChildren || hasFrontMatter;

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
      <div className={styles.contentAligner}>
        {isExpandable ? (
          <ExpandableCell
            // TODO: add support for higlighted connections
            bottomConnection={hasChildren ? "connected" : "none"}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            variant={variant}
          />
        ) : (
          <NonExpandableCell />
        )}
        {children}
      </div>
    </div>
  );
}
