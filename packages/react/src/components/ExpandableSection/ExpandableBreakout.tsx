// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

import { Children, isValidElement } from "react";

import { InternalError } from "../../util/internalError.ts";
import { ConnectingCell } from "../ConnectingCell/ConnectingCell.tsx";
import { BreakoutContents } from "./components/BreakoutContents.tsx";
import styles from "./styles.module.css";
import type {
  ExpandableBreakoutDefaultValueProps,
  ExpandableBreakoutDescriptionProps,
  ExpandableBreakoutExamplesProps,
  ExpandableBreakoutPropertiesProps,
  ExpandableBreakoutProps,
  ExpandableBreakoutTitleProps,
} from "./types.ts";

/**
 * An expandable breakout renders a row in the UI that represents a breakout in
 * a non-object schema, aka a thing with just a name in the header and
 * front-matter, children, etc. in the body.
 *
 * Breakouts take in a series of children with slots, but the default
 * implementation just renders them directly as received. Slots exist for custom
 * implementations that may want to lay out children more specifically.
 */
export function ExpandableBreakout(props: ExpandableBreakoutProps) {
  return <BreakoutContents {...props} />;
}

/**
 * The title of an expandable breakout. This is assigned to the `title` slot.
 */
export function ExpandableBreakoutTitle({
  children,
  slot,
}: ExpandableBreakoutTitleProps) {
  return (
    <div slot={slot} className={styles.titleSlotContainer}>
      {children}
    </div>
  );
}

/**
 * The description of an expandable breakout. This is assigned to the
 * `description` slot.
 */
export function ExpandableBreakoutDescription({
  children,
  slot,
}: ExpandableBreakoutDescriptionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The examples of an expandable breakout. This is assigned to the `examples`
 * slot.
 */
export function ExpandableBreakoutExamples({
  children,
  slot,
}: ExpandableBreakoutExamplesProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The default value of an expandable breakout. This is assigned to the
 * `defaultValue` slot.
 */
export function ExpandableBreakoutDefaultValue({
  children,
  slot,
}: ExpandableBreakoutDefaultValueProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The properties of an expandable breakout. This is assigned to the
 * `properties` slot.
 */
export function ExpandableBreakoutProperties({
  children,
  slot,
}: ExpandableBreakoutPropertiesProps) {
  return (
    <div slot={slot} className={styles.childContainer}>
      {Children.map(children, (child, index) => {
        // Filter out non-React elements to match ConnectingCell's type requirements
        if (!isValidElement(child)) {
          throw new InternalError("Expected a valid React element");
        }

        // `index` is stable for this data, since the children are determined by
        // the compiler and not at runtime
        return (
          <ConnectingCell
            key={index}
            bottom={
              index === Children.count(children) - 1 ? "none" : "connected"
            }
            top="connected"
            right="connected"
          >
            {child}
          </ConnectingCell>
        );
      })}
    </div>
  );
}
