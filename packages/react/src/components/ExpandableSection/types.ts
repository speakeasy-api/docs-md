import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared/types";
import type { FC, PropsWithChildren } from "react";

import type { ConnectingCellProps } from "../ConnectingCell/types.ts";
import type { ExpandableCellProps } from "../ExpandableCell/types.ts";
import type { NonExpandableCellProps } from "../NonExpandableCell/types.ts";
import type { PillProps } from "../Pill/types.ts";

export type ConnectionType = "none" | "connected";

/**
 * Represents the connection state of a prefix cell in the compiled UI
 */
export type Connection = {
  bottom: ConnectionType;
  top: ConnectionType;
  left: ConnectionType;
  right: ConnectionType;
};

/**
 * Represents a node in the tree-representation of a schema. This node is used
 * to determine how to show the node in the UI (e.g. how much indentation, what
 * connections to draw, etc.)
 */
export type TreeNode = {
  id: string;
  headingId: string;
  parent?: TreeNode;
  hasNextSibling: boolean;
  children: TreeNode[];
};

/**
 * A container type for tree data. We store the data in two versions, each of
 * which is optimized for different use cases.
 */
export type TreeData = {
  nodes: TreeNode[];
  nodeMap: Map<string, TreeNode>;
  headingIdToIdMap: Map<string, string>;
};

// TODO: cleanup id vs headingId
/**
 * Properties for a row. Each row represents a node in the tree, but in the
 * "flatted" representation that we actually render nodes in. Each node always
 * occupies exactly one row, with each node stacked one after the other. We use
 * prefix cells to represent their location in the tree.
 */
export type RowProps = PropsWithChildren<{
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
   * Whether the row has front matter or not. This is used to know whether or
   * not to render an expandable header cell in the event when there are no
   * children. In the case of no children, we do render an expandable header
   * cell if the row has front matter, otherwise we do not.
   */
  hasFrontMatter: boolean;
  /**
   * Whether the row should be expanded by default or not on page load, if it
   * has children and/or front matter.
   */
  expandByDefault: boolean;
}>;

export type ExpandableSectionProps = PropsWithChildren;

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
   * ExpandableCell. If you override the default ExpandableCell implementation,
   * then pass your custom implementation in here too. Otherwise, the default
   * ExpandableCell implementation will be used internally.
   */
  ExpandableCell?: FC<ExpandableCellProps>;
  /**
   * The component to use for rendering non-expandable cells, and defaults to
   * NonExpandableCell. If you override the default NonExpandableCell
   * implementation, then pass your custom implementation in here too.
   * Otherwise, the default NonExpandableCell implementation will be used
   * internally.
   */
  NonExpandableCell?: FC<NonExpandableCellProps>;
  /**
   * The component to use for rendering connecting cells, and defaults to
   * ConnectingCell. If you override the default ConnectingCell implementation,
   * then pass your custom implementation in here too. Otherwise, the default
   * ConnectingCell implementation will be used internally.
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

export type ExpandableBreakoutProps = RowProps & {
  /**
   * The component to use for rendering expandable cells, and defaults to
   * ExpandableCell. If you override the default ExpandableCell implementation,
   * then pass your custom implementation in here too. Otherwise, the default
   * ExpandableCell implementation will be used internally.
   */
  ExpandableCell?: FC<ExpandableCellProps>;
  /**
   * The component to use for rendering non-expandable cells, and defaults to
   * NonExpandableCell. If you override the default NonExpandableCell
   * implementation, then pass your custom implementation in here too.
   * Otherwise, the default NonExpandableCell implementation will be used
   * internally.
   */
  NonExpandableCell?: FC<NonExpandableCellProps>;
  /**
   * The component to use for rendering connecting cells, and defaults to
   * ConnectingCell. If you override the default ConnectingCell implementation,
   * then pass your custom implementation in here too. Otherwise, the default
   * ConnectingCell implementation will be used internally.
   */
  ConnectingCell?: FC<ConnectingCellProps>;
};

export type ExpandableBreakoutTitleProps = PropsWithChildren<{ slot: "title" }>;
export type ExpandableBreakoutDescriptionProps = PropsWithChildren<{
  slot: "description";
}>;
export type ExpandableBreakoutExamplesProps = PropsWithChildren<{
  slot: "examples";
}>;
export type ExpandableBreakoutDefaultValueProps = PropsWithChildren<{
  slot: "defaultValue";
}>;
