import type { TreeTopperProps } from "@speakeasy-api/docs-md-components";
import type { PropsWithChildren } from "react";

type ExpandableTreeTopperProps = PropsWithChildren<TreeTopperProps>;

/**
 * A component that renders a tree topper, which is a small dot that indicates
 * the start of a new tree. This component lives at the top of an expandable
 * section.
 */
export function ExpandableTreeTopper(_: ExpandableTreeTopperProps) {
  return <spk-internal-tree-topper></spk-internal-tree-topper>;
}
