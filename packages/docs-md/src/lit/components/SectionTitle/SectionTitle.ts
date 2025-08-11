import clsx from "clsx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ExtendedLitElement } from "../util.ts";

@customElement("speakeasy-section-title")
export class SectionTitle extends ExtendedLitElement {
  @property()
  variant = "primary";

  @property()
  override id = "";

  @property()
  override slot = "";

  public override render() {
    super.render();

    return html`<div
      id=${this.id}
      class=${clsx(
        "speakeasy-section-title--title",
        this.variant === "breakout" && "speakeasy-section-title--breakout",
        this.variant === "top-level" && "speakeasy-section-title--topLevel"
      )}
      slot=${this.slot}
    >
      ${this.variant === "breakout"
        ? html`<div class=${clsx("speakeasy-section-title--breakoutLine")} />`
        : ""}
      ${this.children}
    </div>`;
  }
}
