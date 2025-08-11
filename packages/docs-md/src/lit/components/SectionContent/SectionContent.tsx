import clsx from "clsx";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("speakeasy-section-content")
export class SectionContent extends LitElement {
  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  // Declare reactive properties
  @property()
  variant = "primary";

  @property()
  override id = "";

  @property()
  override slot = "";

  // Render the UI as a function of component state
  public override render() {
    return html`<div
      class=${clsx(
        "speakeasy-section-content--content",
        this.variant === "breakout" && "speakeasy-section-content--breakout",
        this.variant === "top-level" && "speakeasy-section-content--topLevel"
      )}
      id="${this.id}"
      slot="${this.slot}"
    >
      <slot />
    </div>`;
  }
}
