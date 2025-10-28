"use client";

import clsx from "clsx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { LitProps } from "../../../../types/components.ts";
import { SpeakeasyComponent } from "../../../../util/SpeakeasyComponent.ts";
import { styles as litStyles } from "./styles.ts";

/**
 * The connection state for the node. Currently we only have two states, but
 * we use a string union to allow for future expansion (e.g. "highlighted")
 */
type ConnectionType = "none" | "connected";

export type ConnectingCellProps = LitProps<ConnectingCell>;

/**
 * A connecting cell is used to display connecting lines in the tree-view of the
 * schema. This cell does two things:
 * 1. It creates padding to indent the content from the expand button
 * 2. It draws connecting lines from the parent to its children, if they exist
 *
 * If you do not wish to draw a visual indicator for connecting cells, then
 * you'll still need to override it, but you can either just have it return a
 * `div` with a fixed width, or you can have it return `null` and set a margin
 * on the content/padding on the parent to create the same effect.
 */
@customElement("spk-internal-connecting-cell")
export class ConnectingCell extends SpeakeasyComponent {
  static override styles = litStyles;

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
  @property({ type: String })
  public bottom: ConnectionType = "none";

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
  @property({ type: String })
  public top: ConnectionType = "none";

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
  @property({ type: String })
  public right: ConnectionType = "none";

  public override render() {
    return html`<div class="connectingCellRow">
      <div class="connectingCellContainer">
        <!-- Upper left cell, responsible for the top connection -->
        <div
          class="${clsx(
            "upperLeftConnectingCell",
            this.top === "connected" && "verticalConnected"
          )}"
        ></div>
        <!-- Upper right cell, responsible for the right connection -->
        <div
          class="${clsx(
            "upperRightConnectingCell",
            this.right === "connected" && "horizontalConnected"
          )}"
        ></div>
        <!-- Lower left cell, responsible for the bottom connection -->
        <div
          class="${clsx(
            "lowerLeftConnectingCell",
            this.bottom === "connected" && "verticalConnected"
          )}"
        ></div>
        <!-- Lower right cell, not responsible for any connections -->
        <div class="lowerRightConnectingCell"></div>
      </div>
      <div class="connectingCellContent">
        <slot></slot>
      </div>
    </div>`;
  }
}
