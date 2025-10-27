"use client";

import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { LitProps } from "../../../types/components.ts";
import { eventHandler } from "../../../util/decorators.ts";
import { hashManager } from "../../../util/hashManager.ts";
import { SpeakeasyComponent } from "../../../util/SpeakeasyComponent.ts";
import { styles as litStyles } from "./styles.ts";

export type ExpandableBreakoutProps = LitProps<ExpandableBreakout>;

/**
 * A component that renders a tree topper, which is a small dot that indicates
 * the start of a new tree. This component lives at the top of an expandable
 * section.
 */
@customElement("spk-expandable-breakout")
export class ExpandableBreakout extends SpeakeasyComponent {
  static override styles = litStyles;

  /**
   * The identifier for the row. This id is unique within the tree, but is _not_
   * unique in the DOM, and is not used to set the `id` attribute on the DOM
   * element.
   */
  @property({ type: String })
  public entryId!: string;

  /**
   * The parent entryId for the row (not the parent's DOM ID)
   */
  @property({ type: String })
  public parentId?: string;

  /**
   * Whether the row has expandable content or not. This is used to know whether
   * or not to render an expandable header cell in the event when there are no
   * children. In the case of no children, we do render an expandable header
   * cell if the row has expandable content, otherwise we do not.
   */
  @property({ type: Boolean })
  public hasExpandableContent!: boolean;

  /**
   * Whether the row should be expanded by default or not on page load, if it
   * has children and/or front matter.
   */
  @property({ type: Boolean })
  public expandByDefault!: boolean;

  @state()
  private isOpen = false;
  #setIsOpen = eventHandler("spk-toggle", () => (this.isOpen = !this.isOpen));

  override connectedCallback() {
    super.connectedCallback();
    this.isOpen = !!this.expandByDefault;
    hashManager(this.id, (open: boolean) => {
      this.isOpen = open;
    });
  }

  public override render() {
    let details = html``;
    if (this.isOpen) {
      const connection = this.hasSlot("properties") ? "connected" : "none";
      details = html`${this.hasSlot("description")
          ? html`<spk-connecting-cell
              bottom="${connection}"
              top="${connection}"
              right="none"
            >
              <slot name="description"></slot>
            </spk-connecting-cell>`
          : null}
        ${this.hasSlot("examples")
          ? html`<spk-connecting-cell
              bottom="${connection}"
              top="${connection}"
              right="none"
            >
              <slot name="examples"></slot>
            </spk-connecting-cell>`
          : null}
        ${this.hasSlot("defaultValue")
          ? html`<spk-connecting-cell
              bottom="${connection}"
              top="${connection}"
              right="none"
            >
              <slot name="defaultValue"></slot>
            </spk-connecting-cell>`
          : null}
        ${this.hasSlot("embed")
          ? html`<spk-connecting-cell
              bottom="${connection}"
              top="${connection}"
              right="connected"
            >
              <slot name="embed"></slot>
            </spk-connecting-cell>`
          : null} <slot name="properties"></slot>`;
    }

    return html`
      <div class="entryContainer">
        <div data-testid="${this.id}" class="entryHeaderContainer">
          ${this.hasExpandableContent
            ? html`<spk-expandable-cell
                .isOpen="${this.isOpen}"
                @spk-toggle="${this.#setIsOpen}"
                variant="breakout"
              ></spk-expandable-cell>`
            : html`<spk-non-expandable-cell></spk-non-expandable-cell>`}
          <div class="breakoutCellTitle">
            <slot name="title"></slot>
          </div>
        </div>
        ${details}
      </div>
    `;
  }
}
