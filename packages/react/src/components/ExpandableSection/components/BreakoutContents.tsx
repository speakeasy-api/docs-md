"use client";

import { Children, useState } from "react";

import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
import { ConnectingCell } from "../../ConnectingCell.tsx";
import { ExpandableCell } from "../../ExpandableCell.tsx";
import { NonExpandableCell } from "../../NonExpandableCell.tsx";
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
          {Children.count(descriptionChildren) > 0 && (
            <ConnectingCell
              bottom={hasChildrenConnection}
              top={hasChildrenConnection}
              right="none"
            >
              {descriptionChildren}
            </ConnectingCell>
          )}
          {Children.count(examplesChildren) > 0 && (
            <ConnectingCell
              bottom={hasChildrenConnection}
              top={hasChildrenConnection}
              right="none"
            >
              {examplesChildren}
            </ConnectingCell>
          )}
          {Children.count(defaultValueChildren) > 0 && (
            <ConnectingCell
              bottom={hasChildrenConnection}
              top={hasChildrenConnection}
              right="none"
            >
              {defaultValueChildren}
            </ConnectingCell>
          )}
          {Children.count(embedChildren) > 0 && (
            <ConnectingCell
              bottom={hasChildrenConnection}
              top={hasChildrenConnection}
              right="connected"
            >
              {embedChildren}
            </ConnectingCell>
          )}
          {propertiesChildren}
        </>
      )}
    </div>
  );
}
