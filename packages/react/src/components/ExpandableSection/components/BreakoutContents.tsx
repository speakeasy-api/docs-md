"use client";

import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ExpandableCell as DefaultExpandableCell } from "../../ExpandableCell/ExpandableCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { NonExpandableCell as DefaultNonExpandableCell } from "../../NonExpandableCell/NonExpandableCell.tsx";
import { useIsOpen } from "../state.ts";
import styles from "../styles.module.css";
import type { ExpandableBreakoutProps } from "../types.ts";

export function BreakoutContents({
  id,
  slot,
  hasExpandableContent,
  children,
  ExpandableCell = DefaultExpandableCell,
  NonExpandableCell = DefaultNonExpandableCell,
}: ExpandableBreakoutProps) {
  const titleChild = useUniqueChild(children, "title");
  const descriptionChildren = useChildren(children, "description");
  const examplesChildren = useChildren(children, "examples");
  const defaultValueChildren = useChildren(children, "defaultValue");
  const embedChildren = useChildren(children, "embed");
  const propertiesChildren = useChildren(children, "properties");
  const [isOpen, setIsOpen] = useIsOpen(id);
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
        <div className={styles.entryContentContainer}>
          {descriptionChildren}
          {examplesChildren}
          {defaultValueChildren}
          {embedChildren}
          {propertiesChildren}
        </div>
      )}
    </div>
  );
}
