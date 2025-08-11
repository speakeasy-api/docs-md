import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ExtendedLitElement } from "../util.ts";

@customElement("speakeasy-section-tab")
export class SectionTab extends ExtendedLitElement {
  @property()
  override id = "";

  @property()
  override slot = "";

  public override render() {
    super.render();

    return html`<div id="${this.id}" slot="${this.slot}">
      ${this.children}
    </div>`;
  }
}
