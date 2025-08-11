import clsx from "clsx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ExtendedLitElement } from "../util.ts";

@customElement("speakeasy-pill")
export class Pill extends ExtendedLitElement {
  @property()
  variant = "primary";

  public override render() {
    super.render();

    return html`<span
      class=${clsx("speakeasy-pill--common", "speakeasy-pill--" + this.variant)}
      >${this.getAllChildren()}</span
    >`;
  }
}
