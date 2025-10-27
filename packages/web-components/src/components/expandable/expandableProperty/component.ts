"use client";

import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

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
    // TODO:
    const measureContainer = null;

    const frontmatterConnection = this.hasSlot("properties")
      ? "connected"
      : "none";
    const frontmatter = html`
      ${this.hasSlot("description")
        ? html`
            <spk-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="none"
            >
              <slot name="description"></slot>
            </spk-connecting-cell>
          `
        : null}
      ${this.hasSlot("examples")
        ? html`
            <spk-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="none"
            >
              <slot name="examples"></slot>
            </spk-connecting-cell>
          `
        : null}
      ${this.hasSlot("default-value")
        ? html`
            <spk-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="none"
            >
              <slot name="default-value"></slot>
            </spk-connecting-cell>
          `
        : null}
      ${this.hasSlot("embed")
        ? html`
            <spk-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="connected"
            >
              <slot name="embed"></slot>
            </spk-connecting-cell>
          `
        : null}
      ${this.hasSlot("breakouts")
        ? html` <slot name="breakouts"></slot> `
        : null}
    `;

    // TODO:
    const propertyCell = frontmatter;

    return html`<div data-testid=${this.id} class="entryContainer">
      <div class="entryHeaderContainer">
        ${this.hasExpandableContent
          ? html`<spk-expandable-cell
              .isOpen="${this.isOpen}"
              @spk-toggle="${this.#setIsOpen}"
              variant="property"
            ></spk-expandable-cell>`
          : html`<spk-non-expandable-cell></spk-non-expandable-cell>`}
        <slot name="title"></slot>
      </div>
      ${this.isOpen ? propertyCell : null} ${measureContainer}
    </div>`;
  }
}
