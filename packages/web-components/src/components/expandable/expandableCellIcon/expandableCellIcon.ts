"use client";

import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import type { LitProps } from "../../../types/components.ts";
import { styles as litStyles } from "./styles.ts";

export type ExpandableCellIconProps = LitProps<ExpandableCellIcon>;

/**
 * A pill displays a small piece of information inline surrounded by a border
 * and optional background color. The pill takes in a "variant" that controls
 * the color scheme, such as "primary" or "error".
 */
@customElement("spk-expandable-cell-icon")
export class ExpandableCellIcon extends LitElement {
  static override styles = litStyles;

  public override render() {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 20"
      stroke-width="1.5"
      stroke="currentColor"
      width="100%"
      height="100%"
      class="${this.className}"
      style="${this.style}"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 6.25l-7.5 7.5-7.5-7.5"
      />
    </svg>`;
  }
}
