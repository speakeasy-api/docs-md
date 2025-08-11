import clsx from "clsx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ExtendedLitElement } from "../util.ts";

@customElement("speakeasy-section")
export class Section extends ExtendedLitElement {
  @property()
  variant = "primary";

  public override render() {
    super.render();

    const titleChild = this.getUniqueChild("title");
    const contentChildren = this.getChildren("content");

    return html`<div
      class=${clsx(this.variant !== "breakout" && "speakeasy-section--section")}
    >
      <div>${titleChild}</div>
      <div
        class=${clsx(
          this.variant === "breakout" && "speakeasy-section--breakout",
          this.variant === "top-level" && "speakeasy-section--topLevel"
        )}
      >
        ${contentChildren}
      </div>
    </div>`;
  }
}
