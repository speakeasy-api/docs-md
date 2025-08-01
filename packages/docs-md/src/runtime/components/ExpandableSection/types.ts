import type { PropsWithChildren } from "react";

type ConnectionType = "none" | "connected" | "highlighted";

export type Connection = {
  bottom: ConnectionType;
  top: ConnectionType;
  left: ConnectionType;
  right: ConnectionType;
};

export type TreeNode = {
  id: string;
  headingId: string;
  parent?: TreeNode;
  hasNextSibling: boolean;
  children: TreeNode[];
};

export type TreeData = {
  nodes: TreeNode[];
  nodeMap: Map<string, TreeNode>;
  headingIdToIdMap: Map<string, string>;
};

export type RowProps = PropsWithChildren<{
  id: string;
  slot: "entry";
  headingId: string;
  parentId?: string;
}>;
