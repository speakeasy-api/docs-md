import type { ReactElement } from "react";

/**
 * The connection state for the node. Currently we only have two states, but
 * we use a string union to allow for future expansion (e.g. "highlighted")
 */
type ConnectionType = "none" | "connected";

// See ../ExpandableSection/types.ts for documentation
export type ConnectingCellProps = {
  /**
   * The connection state for the node to the node immediately below it, as
   * represented by `|` in the diagram below if the state is `connected`:
   *
   * ```
   * *****
   * *   *
   * * o *
   * * | *
   * *****
   * ```
   */
  bottom: ConnectionType;
  /**
   * The connection state for the node to the node above it, as represented by
   * `|` in the diagram below if the state is `connected`:
   *
   * ```
   * *****
   * * | *
   * * o *
   * *   *
   * *****
   * ```
   */
  top: ConnectionType;
  /**
   * The connection state for the node to the node immediately right of it, as
   * represented by `-` in the diagram below if the state is `connected`:
   *
   * ```
   * *****
   * *   *
   * * o-*
   * *   *
   * *****
   * ```
   */
  right: ConnectionType;
  /**
   * The children to render inside the connecting cell, as returned from the
   * `useChildren` hook, or a single child from a `.map` on `useChildren`
   */
  children: ReactElement<unknown>[] | ReactElement<unknown>;
};
