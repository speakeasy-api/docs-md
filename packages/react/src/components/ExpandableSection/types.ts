import type {
  ExpandableBreakoutProps as ExpandableBreakoutElementProps,
  ExpandablePropertyProps as ExpandablePropertyElementProps,
} from "@speakeasy-api/docs-md-components";
import type { PropsWithChildren } from "react";

export type ExpandableSectionProps = PropsWithChildren;

export type ExpandablePropertyProps =
  PropsWithChildren<ExpandablePropertyElementProps>;

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

export type ExpandableBreakoutProps =
  PropsWithChildren<ExpandableBreakoutElementProps>;

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
