import clsx from "clsx";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("speakeasy-section")
export class Section extends LitElement {
  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  // Declare reactive properties
  @property()
  variant = "primary";

  // Render the UI as a function of component state
  public override render() {
    return html`<div
      class=${clsx(this.variant !== "breakout" && "speakeasy-section--section")}
    >
      <div><slot name="title" /></div>
      <div
        class=${clsx(
          this.variant === "breakout" && "speakeasy-section--breakout",
          this.variant === "top-level" && "speakeasy-section--topLevel"
        )}
      >
        <slot name="content" />
      </div>
    </div>`;
  }
}
