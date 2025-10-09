"use client";

import type { PillVariant } from "@speakeasy-api/docs-md-shared";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { styles as litStyles } from "./styles.ts";
import type { PillProps } from "./types.ts";

/**
 * A pill displays a small piece of information inline surrounded by a border
 * and optional background color. The pill takes in a "variant" that controls
 * the color scheme, such as "primary" or "error".
 */
export function Pill({ variant, children }: PillProps) {
  return (
    <spk-pill variant={variant}>
      <div slot="content">{children}</div>
    </spk-pill>
  );
}

@customElement("spk-pill")
export class PillElement extends LitElement {
  static override styles = litStyles;

  @property({ type: String })
  public variant: PillVariant = "primary";

  public override render() {
    return html`<span class="pill ${this.variant}">
      <slot name="content"></slot>
    </span>`;
  }
}
