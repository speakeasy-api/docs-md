import clsx from "clsx";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("speakeasy-pill")
export class Pill extends LitElement {
  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  // Declare reactive properties
  @property()
  variant = "primary";

  // Render the UI as a function of component state
  public override render() {
    return html`<span
      class=${clsx("speakeasy-pill--common", "speakeasy-pill--" + this.variant)}
    >
      ${this.children}
    </span>`;
  }
}
