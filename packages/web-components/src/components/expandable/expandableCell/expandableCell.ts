"use client";

import clsx from "clsx";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { LitProps } from "../../../types/components.ts";
import type { EventDispatcher } from "../../../util/decorators.ts";
import { event } from "../../../util/decorators.ts";
import { styles as litStyles } from "./styles.ts";

export type ExpandableCellProps = LitProps<ExpandableCell>;

/**
 * An Expandable cell is part of a schema row. It is responsible for rendering
 * the expandable button used in the tree-view of the schema. Each row always
 * has either one ExpandableCell or one NonExpandableCell, and are always to the
 * right of the connecting cells.
 *
 * We use an expandable cell any time a breakout/property has children (other
 * breakouts/properties) and/or has front matter (description, examples,
 * default value, etc.)
 *
 * Note: this is a controlled component. The initial open/closed state is set by
 * the compiled MDX code, and its state is managed by
 * src/components/ExpandableSection/components/PrefixCells.tsx
 */
@customElement("spk-expandable-cell")
export class ExpandableCell extends LitElement {
  static override styles = litStyles;

  /**
   * Whether the cell is currently open or not.
   */
  @property({ type: Boolean })
  public isOpen!: boolean;

  /**
   * The variant of the cell
   */
  @property({ type: String })
  public variant!: "breakout" | "property";

  /**
   * Dispatches the 'spk-toggle' event when the cell is toggled
   */
  @event({ type: "spk-toggle", bubbles: false, composed: true })
  private dispatchToggle!: EventDispatcher<null>;

  public override render() {
    return html`<div class="expandableCellContainer">
      <div class="expandableButtonContainer">
        <button
          class=${clsx(
            "expandableButton",
            this.variant === "property" && "expandableButtonCircle"
          )}
          aria-expanded=${this.isOpen}
          type="button"
          @click="${() => this.dispatchToggle(null)}"
        >
          <spk-expandable-cell-icon
            class="expandableChevron"
            style="transform: ${this.isOpen
              ? "rotate(0deg)"
              : "rotate(-90deg)"};"
          ></spk-expandable-cell-icon>
        </button>
      </div>
      <div class="expandableConnectionContainer">
        <div class="expandableConnection"></div>
      </div>
    </div>`;
  }
}
