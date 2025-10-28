"use client";

import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { LitProps } from "../../../types/components.ts";
import { hashManager } from "../../../util/hashManager.ts";
import { styles as litStyles } from "./styles.ts";

export type ExpandableBreakoutProps = LitProps<ExpandableBreakout> & {
  // We need to include `id` to make typing happy in the compiler, even though
  // it's already present on all DOM elements.
  id: string;
};

/**
 * A component that renders a tree topper, which is a small dot that indicates
 * the start of a new tree. This component lives at the top of an expandable
 * section.
 */
@customElement("spk-expandable-breakout")
export class ExpandableBreakout extends LitElement {
  static override styles = litStyles;

  /**
   * Whether or not this property has a description
   */
  @property({ type: Boolean })
  public hasDescription!: true | undefined;

  /**
   * Whether or not this property has examples
   */
  @property({ type: Boolean })
  public hasExamples!: true | undefined;

  /**
   * Whether or not this property has a default value
   */
  @property({ type: Boolean })
  public hasDefaultValue!: true | undefined;

  /**
   * Whether or not this property has an embed
   */
  @property({ type: Boolean })
  public hasEmbed!: true | undefined;

  /**
   * Whether or not this property has properties
   */
  @property({ type: Boolean })
  public hasProperties!: true | undefined;

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
   * Whether the row should be expanded by default or not on page load, if it
   * has children and/or front matter.
   */
  @property({ type: Boolean })
  public expandByDefault!: boolean;

  @state()
  private isOpen = false;
  private handleExpandToggle = () => {
    this.isOpen = !this.isOpen;
  };

  public override connectedCallback() {
    super.connectedCallback();
    this.isOpen = !!this.expandByDefault;
    hashManager(this.id, (open: boolean) => {
      this.isOpen = open;
    });
  }

  public override render() {
    let details = html``;
    if (this.isOpen) {
      const connection = this.hasProperties ? "connected" : "none";
      details = html`${this.hasDescription
        ? html`<spk-internal-connecting-cell
            bottom="${connection}"
            top="${connection}"
            right="none"
          >
            <slot name="description"></slot>
          </spk-internal-connecting-cell>`
        : nothing}
      ${this.hasExamples
        ? html`<spk-internal-connecting-cell
            bottom="${connection}"
            top="${connection}"
            right="none"
          >
            <slot name="examples"></slot>
          </spk-internal-connecting-cell>`
        : nothing}
      ${this.hasDefaultValue
        ? html`<spk-internal-connecting-cell
            bottom="${connection}"
            top="${connection}"
            right="none"
          >
            <slot name="defaultValue"></slot>
          </spk-internal-connecting-cell>`
        : nothing}
      ${this.hasEmbed
        ? html`<spk-internal-connecting-cell
            bottom="${connection}"
            top="${connection}"
            right="connected"
          >
            <slot name="embed"></slot>
          </spk-internal-connecting-cell>`
        : nothing}
      ${this.hasProperties ? html` <slot name="properties"></slot>` : nothing}`;
    }

    const hasExpandableContent =
      !!this.hasDescription ||
      !!this.hasExamples ||
      !!this.hasDefaultValue ||
      !!this.hasEmbed ||
      !!this.hasProperties;
    return html`
      <div class="entryContainer">
        <div data-testid="${this.id}" class="entryHeaderContainer">
          ${hasExpandableContent
            ? html`<spk-internal-expandable-cell
                .isOpen="${this.isOpen}"
                .onExpandToggle="${this.handleExpandToggle}"
                variant="breakout"
              ></spk-internal-expandable-cell>`
            : html`<spk-internal-non-expandable-cell></spk-internal-non-expandable-cell>`}
          <div class="breakoutCellTitle">
            <slot name="title"></slot>
          </div>
        </div>
        ${details}
      </div>
    `;
  }
}
