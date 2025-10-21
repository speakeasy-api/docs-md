"use client";

import type { PillVariant } from "@speakeasy-api/docs-md-shared";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { LitProps, ReactCustomElement } from "../../types/components.ts";
import { styles as litStyles } from "./styles.ts";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface HTMLElementTagNameMap {
    "spk-pill": Pill;
  }
}

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      ["spk-pill"]: ReactCustomElement<Pill>;
    }
  }
}

export type PillProps = LitProps<Pill>;

/**
 * A pill displays a small piece of information inline surrounded by a border
 * and optional background color. The pill takes in a "variant" that controls
 * the color scheme, such as "primary" or "error".
 */
@customElement("spk-pill")
export class Pill extends LitElement {
  static override styles = litStyles;

  /**
   * The variant to use for the pill, one of:
   * - "error"
   * - "warning"
   * - "info"
   * - "success"
   * - "primary"
   * - "secondary"
   */
  @property({ type: String })
  public variant: PillVariant = "primary";

  public override render() {
    return html`<span class="pill ${this.variant}">
      <slot></slot>
    </span>`;
  }
}
