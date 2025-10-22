"use client";

import { useState } from "react";

import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
import { ConnectingCell } from "../../ConnectingCell/ConnectingCell.tsx";
import { ExpandableCell } from "../../ExpandableCell/ExpandableCell.tsx";
import { NonExpandableCell } from "../../NonExpandableCell/NonExpandableCell.tsx";
import { useHashManager } from "../hashManager.ts";
import styles from "../styles.module.css";
import type { ExpandableBreakoutProps } from "../types.ts";

export function BreakoutContents({
  headingId,
  slot,
  hasExpandableContent,
  expandByDefault,
  children,
}: ExpandableBreakoutProps) {
  const titleChild = useUniqueChild(children, "title");
  const descriptionChildren = useChildren(children, "description");
  const examplesChildren = useChildren(children, "examples");
  const defaultValueChildren = useChildren(children, "defaultValue");
  const embedChildren = useChildren(children, "embed");
  const propertiesChildren = useChildren(children, "properties");
  const [isOpen, setIsOpen] = useState(expandByDefault);
  const hasChildrenConnection =
    propertiesChildren.length > 0 ? "connected" : "none";

  useHashManager(headingId, setIsOpen);

  return (
    <div slot={slot} className={styles.entryContainer}>
      <div data-testid={headingId} className={styles.entryHeaderContainer}>
        {hasExpandableContent ? (
          <ExpandableCell
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            variant="breakout"
          />
        ) : (
          <NonExpandableCell />
        )}
        <div className={styles.breakoutCellTitle}>{titleChild}</div>
      </div>
      {isOpen && (
        <>
          <ConnectingCell
            bottom={hasChildrenConnection}
            top={hasChildrenConnection}
            right="none"
          >
            {descriptionChildren}
          </ConnectingCell>
          <ConnectingCell
            bottom={hasChildrenConnection}
            top={hasChildrenConnection}
            right="none"
          >
            {examplesChildren}
          </ConnectingCell>
          <ConnectingCell
            bottom={hasChildrenConnection}
            top={hasChildrenConnection}
            right="none"
          >
            {defaultValueChildren}
          </ConnectingCell>
          <ConnectingCell
            bottom={hasChildrenConnection}
            top={hasChildrenConnection}
            right="connected"
          >
            {embedChildren}
          </ConnectingCell>
          {propertiesChildren}
        </>
      )}
    </div>
  );
}
