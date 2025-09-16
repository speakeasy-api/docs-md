import type { Connection } from "../ExpandableSection/types.ts";

// See ../ExpandableSection/types.ts for documentation
export type ConnectingCellProps = Pick<Connection, "bottom" | "top" | "right">;
