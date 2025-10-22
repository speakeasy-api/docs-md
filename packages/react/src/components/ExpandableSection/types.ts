import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared";
import type { PropsWithChildren } from "react";

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
}>;

export type ExpandableBreakoutProps = RowProps;

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
}>;
