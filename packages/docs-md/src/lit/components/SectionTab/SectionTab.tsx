import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("speakeasy-section-tab")
export class SectionTab extends LitElement {
  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  @property()
  override id = "";

  @property()
  override slot = "";

  // Render the UI as a function of component state
  public override render() {
    return html`<div id="${this.id}" slot="${this.slot}">
      <slot />
    </div>`;
  }
}
