"use client";

import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared";
import { InternalError } from "@speakeasy-api/docs-md-shared";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Ref } from "lit/directives/ref.js";
import { createRef, ref } from "lit/directives/ref.js";

import type { LitProps } from "../../../types/components.ts";
import { hashManager } from "../../../util/hashManager.ts";
import { SpeakeasyComponent } from "../../../util/SpeakeasyComponent.ts";
import { styles as litStyles } from "./styles.ts";

export type ExpandablePropertyProps = LitProps<ExpandableProperty> & {
  // We need to include `id` to make typing happy in the compiler, even though
  // it's already present on all DOM elements.
  id: string;
};

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
   * The display type information for the property, as computed by the compiler
   */
  @property({ type: String })
  public typeInfo!: string;
  private parsedTypeInfo?: DisplayTypeInfo;

  /**
   * The annotations for the property (e.g. "required")
   */
  @property({ type: String })
  public typeAnnotations!: string;
  private parsedTypeAnnotations?: PropertyAnnotations[];

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

  private titlePrefixContainerRef: Ref<HTMLInputElement> = createRef();

  override connectedCallback() {
    super.connectedCallback();
    this.isOpen = !!this.expandByDefault;
    this.parsedTypeInfo = JSON.parse(this.typeInfo) as DisplayTypeInfo;
    this.parsedTypeAnnotations = JSON.parse(
      this.typeAnnotations
    ) as PropertyAnnotations[];
    hashManager(this.id, (open: boolean) => {
      this.isOpen = open;
    });
  }

  public override render() {
    if (!this.parsedTypeInfo || !this.parsedTypeAnnotations) {
      throw new InternalError(
        "parsedTypeInfo and parsedTypeAnnotations are unexpectedly undefined"
      );
    }

    // TODO:
    const measureContainer = nothing;
    const titleContainer = nothing;

    const titlePrefix = html`
      <span
        class="propertyTitlePrefixContainer"
        ${ref(this.titlePrefixContainerRef)}
      >
        <slot name="title"></slot>
        ${this.parsedTypeAnnotations?.map(
          (annotation) => html`
            <spk-pill variant="${annotation.variant}">
              ${annotation.title}
            </spk-pill>
          `
        )}
      </span>
    `;
    console.log(titlePrefix);

    const frontmatterConnection = this.hasSlot("properties")
      ? "connected"
      : "none";
    const frontmatter = html`
      ${this.hasSlot("description")
        ? html`
            <spk-internal-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="none"
            >
              <slot name="description"></slot>
            </spk-internal-connecting-cell>
          `
        : nothing}
      ${this.hasSlot("examples")
        ? html`
            <spk-internal-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="none"
            >
              <slot name="examples"></slot>
            </spk-internal-connecting-cell>
          `
        : nothing}
      ${this.hasSlot("default-value")
        ? html`
            <spk-internal-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="none"
            >
              <slot name="default-value"></slot>
            </spk-internal-connecting-cell>
          `
        : nothing}
      ${this.hasSlot("embed")
        ? html`
            <spk-internal-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="connected"
            >
              <slot name="embed"></slot>
            </spk-internal-connecting-cell>
          `
        : nothing}
      ${this.hasSlot("breakouts")
        ? html` <slot name="breakouts"></slot> `
        : nothing}
    `;

    // TODO:
    const propertyCell = frontmatter;

    return html`<div data-testid=${this.id} class="entryContainer">
      <div class="entryHeaderContainer">
        ${this.hasExpandableContent
          ? html`<spk-internal-expandable-cell
              .isOpen="${this.isOpen}"
              .onExpandToggle="${this.handleExpandToggle}"
              variant="property"
            ></spk-internal-expandable-cell>`
          : html`<spk-internal-non-expandable-cell></spk-internal-non-expandable-cell>`}
        ${titleContainer}
      </div>
      ${this.isOpen ? propertyCell : nothing} ${measureContainer}
    </div>`;
  }
}
