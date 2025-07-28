type ConnectionType = "none" | "connected" | "highlighted";

export type ConnectionCellProps = {
  bottom: ConnectionType;
  top: ConnectionType;
  left: ConnectionType;
  right: ConnectionType;
};
