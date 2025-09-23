"use client";

import { useState } from "react";

import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
// eslint-disable-next-line fast-import/no-restricted-imports
import { ConnectingCell as DefaultConnectingCell } from "../../ConnectingCell/ConnectingCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports
import { ExpandableCell as DefaultExpandableCell } from "../../ExpandableCell/ExpandableCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports
import { NonExpandableCell as DefaultNonExpandableCell } from "../../NonExpandableCell/NonExpandableCell.tsx";
import styles from "../styles.module.css";
import type { ExpandableBreakoutProps } from "../types.ts";

export function BreakoutContents({
  slot,
  hasExpandableContent,
  expandByDefault,
  children,
  ExpandableCell = DefaultExpandableCell,
  NonExpandableCell = DefaultNonExpandableCell,
  ConnectingCell = DefaultConnectingCell,
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
  return (
    <div slot={slot} className={styles.entryContainer}>
      <div className={styles.entryHeaderContainer}>
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
          {/* `index` is stable for this data, since the children are
              determined by the compiler and not at runtime */}
          {propertiesChildren.map((propertyChild, index) => (
            <ConnectingCell
              key={index}
              bottom={
                index === propertiesChildren.length - 1 ? "none" : "connected"
              }
              top="connected"
              right="connected"
            >
              {propertyChild}
            </ConnectingCell>
          ))}
        </>
      )}
    </div>
  );
}
