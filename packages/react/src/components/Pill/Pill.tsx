"use client";

import type { PillVariant } from "@speakeasy-api/docs-md-shared";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { PropsWithChildren } from "react";

import { styles as litStyles } from "./styles.ts";

type LitElementProps = keyof LitElement;

export type PillProps = PropsWithChildren<
  Omit<PillElement, LitElementProps | "render" | "renderRoot">
>;

@customElement("spk-pill")
export class PillElement extends LitElement {
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
