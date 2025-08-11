import clsx from "clsx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ExtendedLitElement } from "../util.ts";

@customElement("speakeasy-section-content")
export class SectionContent extends ExtendedLitElement {
  @property()
  variant = "primary";

  @property()
  override id = "";

  @property()
  override slot = "";

  public override render() {
    super.render();

    return html`<div
      class=${clsx(
        "speakeasy-section-content--content",
        this.variant === "breakout" && "speakeasy-section-content--breakout",
        this.variant === "top-level" && "speakeasy-section-content--topLevel"
      )}
      id="${this.id}"
      slot="${this.slot}"
    >
      ${this.children}
    </div>`;
  }
}
