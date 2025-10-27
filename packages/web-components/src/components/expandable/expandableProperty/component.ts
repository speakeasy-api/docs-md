"use client";

import { html } from "lit";
import { customElement, state } from "lit/decorators.js";

import type { LitProps } from "../../../types/components.ts";
import { eventHandler } from "../../../util/decorators.ts";
import { hashManager } from "../../../util/hashManager.ts";
import { SpeakeasyComponent } from "../../../util/SpeakeasyComponent.ts";
import { styles as litStyles } from "./styles.ts";

export type ExpandablePropertyProps = LitProps<ExpandableProperty>;

/**
 * A component that renders a tree topper, which is a small dot that indicates
 * the start of a new tree. This component lives at the top of an expandable
 * section.
 */
@customElement("spk-expandable-property")
export class ExpandableProperty extends SpeakeasyComponent {
  static override styles = litStyles;

  @state()
  private isOpen = false;
  #setIsOpen = eventHandler("spk-toggle", () => (this.isOpen = !this.isOpen));

  override connectedCallback() {
    super.connectedCallback();
    hashManager(this.id, (open: boolean) => {
      this.isOpen = open;
    });
  }

  public override render() {
    return html`<div class="property">
      <div class="propertyDot"></div>
    </div>`;
  }
}
