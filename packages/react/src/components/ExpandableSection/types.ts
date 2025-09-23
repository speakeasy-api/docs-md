import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared/types";
import type { FC, PropsWithChildren } from "react";

import type { ConnectingCellProps } from "../ConnectingCell/types.ts";
import type { ExpandableCellProps } from "../ExpandableCell/types.ts";
import type { ExpandableTreeTopperProps } from "../ExpandableTreeTopper/types.ts";
import type { NonExpandableCellProps } from "../NonExpandableCell/types.ts";
import type { PillProps } from "../Pill/types.ts";

// TODO: cleanup id vs headingId
/**
 * Properties for a row. Each row represents a node in the tree, but in the
 * "flatted" representation that we actually render nodes in. Each node always
 * occupies exactly one row, with each node stacked one after the other. We use
 * prefix cells to represent their location in the tree.
 */
type RowProps = PropsWithChildren<{
  /**
   * The identifier for the row. This id is unique within the tree, but is _not_
   * unique in the DOM, and is not used to set the `id` attribute on the DOM
   * element.
   */
  id: string;
  /**
   * The slot for the row, always "entry"
   */
  slot: "entry";
  /**
   * The heading ID for the row. This is the ID that is used in the DOM.
   */
  headingId: string;
  /**
   * The parent ID for the row (not the parent's heading ID)
   */
  parentId?: string;
  /**
   * Whether the row has expandable content or not. This is used to know whether
   * or not to render an expandable header cell in the event when there are no
   * children. In the case of no children, we do render an expandable header
   * cell if the row has expandable content, otherwise we do not.
   */
  hasExpandableContent: boolean;
  /**
   * Whether the row should be expanded by default or not on page load, if it
   * has children and/or front matter.
   */
  expandByDefault: boolean;
}>;

export type ExpandableSectionProps = PropsWithChildren<{
  /**
   * The component to use for rendering the tree top decoration, and defaults to
   * ExpandableTreeTopper. Override this property to use a custom version.
   */
  ExpandableTreeTopper?: FC<ExpandableTreeTopperProps>;
  /**
   * The component to use for rendering connecting cells, and defaults to
   * ConnectingCell. Override this property to use a custom version.
   */
  ConnectingCell?: FC<ConnectingCellProps>;
}>;

export type ExpandablePropertyProps = RowProps & {
  /**
   * The display type information for the property, as computed by the compiler
   */
  typeInfo?: DisplayTypeInfo;
  /**
   * The annotations for the property (e.g. "required")
   */
  typeAnnotations: PropertyAnnotations[];
  /**
   * The component to use for rendering annotations, and defaults to Pill. If
   * you override the default Pill implementation, then pass your custom
   * implementation in here too. Otherwise, the default Pill implementation will
   * be used internally.
   */
  Pill?: FC<PillProps>;
  /**
   * The component to use for rendering expandable cells, and defaults to
   * ExpandableCell. Override this property to use a custom version.
   */
  ExpandableCell?: FC<ExpandableCellProps>;
  /**
   * The component to use for rendering non-expandable cells, and defaults to
   * NonExpandableCell. Override this property to use a custom version.
   */
  NonExpandableCell?: FC<NonExpandableCellProps>;
  /**
   * The component to use for rendering connecting cells, and defaults to
   * ConnectingCell. Override this property to use a custom version.
   */
  ConnectingCell?: FC<ConnectingCellProps>;
};

export type ExpandablePropertyTitleProps = PropsWithChildren<{
  /**
   * The slot for the title, always "title"
   */
  slot: "title";
}>;

export type ExpandablePropertyDescriptionProps = PropsWithChildren<{
  /**
   * The slot for the description, always "description"
   */
  slot: "description";
}>;

export type ExpandablePropertyExamplesProps = PropsWithChildren<{
  /**
   * The slot for the examples, always "examples"
   */
  slot: "examples";
}>;

export type ExpandablePropertyDefaultValueProps = PropsWithChildren<{
  /**
   * The slot for the default value, always "defaultValue"
   */
  slot: "defaultValue";
}>;

export type ExpandablePropertyBreakoutsProps = PropsWithChildren<{
  /**
   * The slot for the breakouts, always "breakouts"
   */
  slot: "breakouts";
  /**
   * The component to use for rendering connecting cells, and defaults to
   * ConnectingCell. Override this property to use a custom version.
   */
  ConnectingCell?: FC<ConnectingCellProps>;
}>;

export type ExpandableBreakoutProps = RowProps & {
  /**
   * The component to use for rendering expandable cells, and defaults to
   * ExpandableCell. Override this property to use a custom version.
   */
  ExpandableCell?: FC<ExpandableCellProps>;
  /**
   * The component to use for rendering non-expandable cells, and defaults to
   * NonExpandableCell. Override this property to use a custom version.
   */
  NonExpandableCell?: FC<NonExpandableCellProps>;
  /**
   * The component to use for rendering connecting cells, and defaults to
   * ConnectingCell. Override this property to use a custom version.
   */
  ConnectingCell?: FC<ConnectingCellProps>;
};

export type ExpandableBreakoutTitleProps = PropsWithChildren<{ slot: "title" }>;
export type ExpandableBreakoutDescriptionProps = PropsWithChildren<{
  /**
   * The slot for the description, always "description"
   */
  slot: "description";
}>;
export type ExpandableBreakoutExamplesProps = PropsWithChildren<{
  /**
   * The slot for the examples, always "examples"
   */
  slot: "examples";
}>;
export type ExpandableBreakoutDefaultValueProps = PropsWithChildren<{
  /**
   * The slot for the default value, always "defaultValue"
   */
  slot: "defaultValue";
}>;
export type ExpandableBreakoutPropertiesProps = PropsWithChildren<{
  /**
   * The slot for the properties, always "properties"
   */
  slot: "properties";
  /**
   * The component to use for rendering connecting cells, and defaults to
   * ConnectingCell. Override this property to use a custom version.
   */
  ConnectingCell?: FC<ConnectingCellProps>;
}>;
