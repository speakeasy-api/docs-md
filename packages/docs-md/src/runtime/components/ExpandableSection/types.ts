type ConnectionType = "none" | "connected" | "highlighted";

export type Connection = {
  bottom: ConnectionType;
  top: ConnectionType;
  left: ConnectionType;
  right: ConnectionType;
};

export type TreeNode = {
  id: string;
  parent?: TreeNode;
  hasNextSibling: boolean;
  children: TreeNode[];
};

export type TreeData = {
  nodes: TreeNode[];
  nodeMap: Map<string, TreeNode>;
};
