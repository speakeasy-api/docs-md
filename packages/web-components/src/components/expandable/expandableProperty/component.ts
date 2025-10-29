"use client";

import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared";
import { InternalError } from "@speakeasy-api/docs-md-shared";
import clsx from "clsx";
import type { TemplateResult } from "lit";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Ref } from "lit/directives/ref.js";
import { createRef, ref } from "lit/directives/ref.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import type { LitProps } from "../../../types/components.ts";
import {
  computeMultilineTypeLabel,
  computeSingleLineDisplayType,
} from "../../../util/displayType.ts";
import { hashManager } from "../../../util/hashManager.ts";
import { styles as litStyles } from "./styles.ts";

@customElement("spk-internal-expandable-property-title-container")
export class ExpandablePropertyTitleContainer extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
  `;

  @property({ type: Function })
  public onSizeChanged!: (containerWidth: number) => void;

  private resizeObserver?: ResizeObserver;

  public override connectedCallback(): void {
    super.connectedCallback();

    // Set up ResizeObserver first
    this.resizeObserver = new ResizeObserver(() => this.measureAndNotify());
    this.resizeObserver.observe(this);

    // Initial measurement after first render
    this.measureAndNotify();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }

  private measureAndNotify(): void {
    const containerWidth = this.offsetWidth;
    if (containerWidth > 0) {
      this.onSizeChanged(containerWidth);
    }
  }

  public override render() {
    return html`<slot></slot>`;
  }
}

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
export class ExpandableProperty extends LitElement {
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
   * Whether or not this property has breakouts
   */
  @property({ type: Boolean })
  public hasBreakouts!: true | undefined;

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
   * The display type information for the property, as computed by the compiler
   */
  @property({
    converter: (value) => {
      if (!value) {
        throw new InternalError("Missing typeInfo");
      }
      return JSON.parse(value) as DisplayTypeInfo;
    },
  })
  public typeInfo!: DisplayTypeInfo;

  /**
   * The annotations for the property (e.g. "required")
   */
  @property({
    converter: (value) => {
      if (!value) {
        throw new InternalError("Missing typeAnnotations");
      }
      return JSON.parse(value) as PropertyAnnotations[];
    },
  })
  public typeAnnotations!: PropertyAnnotations[];

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

  // Refs for DOM elements used to measure the size of type information, and to
  // make it responsive and formatted
  private titlePrefixContainerRef: Ref<HTMLElement> = createRef();
  private offscreenTextSizeMeasureContainerRef: Ref<HTMLElement> = createRef();
  private offscreenTypeMeasureContainerRef: Ref<HTMLElement> = createRef();

  // The computed single line display type and measure
  private singleLineDisplayType?: {
    measure: string;
    display: string;
  };

  // The computed display info (multiline flag and contents)
  @state()
  private multiline?: boolean;
  @state()
  private contents?: string;

  public override connectedCallback() {
    super.connectedCallback();

    // Initialize properties
    this.isOpen = !!this.expandByDefault;

    // Watch for hash changes so we can toggle the open state
    hashManager(this.id, (open) => {
      this.isOpen = open;
    });
  }

  private handleTitleContainerSizeChanged = (titleContainerWidth: number) => {
    if (!this.singleLineDisplayType) {
      return;
    }

    // Get widths from refs
    const offscreenTextSizeMeasureContainerWidth =
      this.offscreenTextSizeMeasureContainerRef.value?.offsetWidth ?? 0;
    const offscreenTypeMeasureContainerWidth =
      this.offscreenTypeMeasureContainerRef.value?.offsetWidth ?? 0;
    const titlePrefixContainerWidth =
      this.titlePrefixContainerRef.value?.offsetWidth ?? 0;

    // If the value is 0, that means we haven't rendered yet and don't know the
    // width. In this case, we just don't render the type at all.
    if (offscreenTextSizeMeasureContainerWidth === 0) {
      this.multiline = false;
      this.contents = "";
      return;
    }

    // Determine if we need to show this in two lines, based on the width of the
    // the measured single line type
    const multiline =
      offscreenTypeMeasureContainerWidth >
      titleContainerWidth - titlePrefixContainerWidth;

    // If the measured width is 0, that means we're running on the server in which
    // case we want to render content on a single line. We only need maxCharacters
    // in the multiline case, so we don't need to consider the title width when
    // computing max characters.
    const maxMultilineCharacters =
      titleContainerWidth === 0 || offscreenTextSizeMeasureContainerWidth === 0
        ? Infinity
        : // We subtract 4 here to account for the padding on the left and right
          Math.floor(
            titleContainerWidth / offscreenTextSizeMeasureContainerWidth
          ) - 4;

    // Finally, if we are multiline, compute the multiline type label, otherwise
    // we can reuse the single line version we already computed
    const contents = multiline
      ? computeMultilineTypeLabel(this.typeInfo, 0, maxMultilineCharacters)
          .contents
      : this.singleLineDisplayType.display;

    this.multiline = multiline;
    this.contents = contents;
  };

  public override render() {
    if (!this.typeInfo) {
      throw new InternalError("typeInfo is unexpectedly undefined");
    }
    if (!this.typeAnnotations) {
      throw new InternalError("typeAnnotations is unexpectedly undefined");
    }
    this.singleLineDisplayType ??= computeSingleLineDisplayType(this.typeInfo);

    const titlePrefix = html`
      <span
        class="propertyTitlePrefixContainer"
        ${ref(this.titlePrefixContainerRef)}
      >
        <slot name="title"></slot>
        ${this.typeAnnotations?.map(
          (annotation) => html`
            <spk-pill variant="${annotation.variant}">
              ${annotation.title}
            </spk-pill>
          `
        )}
      </span>
    `;

    const frontmatterConnection = this.hasBreakouts ? "connected" : "none";
    const frontmatter = html`
      ${this.hasDescription
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
      ${this.hasExamples
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
      ${this.hasDefaultValue
        ? html`
            <spk-internal-connecting-cell
              bottom="${frontmatterConnection}"
              top="${frontmatterConnection}"
              right="none"
            >
              <slot name="defaultValue"></slot>
            </spk-internal-connecting-cell>
          `
        : nothing}
      ${this.hasEmbed
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
      ${this.hasBreakouts ? html` <slot name="breakouts"></slot> ` : nothing}
    `;

    let titleContainer: TemplateResult;
    let propertyCell: TemplateResult;
    if (this.multiline === undefined) {
      titleContainer = html`<spk-internal-expandable-property-title-container
        .onSizeChanged=${this.handleTitleContainerSizeChanged}
      >
        <div class="propertyTitleContainer">${titlePrefix}</div>
      </spk-internal-expandable-property-title-container>`;

      propertyCell = frontmatter;
    } else {
      const typeContainer = html` <div>
        <div
          class="${clsx(
            "typeInnerContainer",
            this.multiline
              ? "typeInnerContainerMultiline"
              : "typeInnerContainerInline"
          )}"
        >
          ${unsafeHTML(this.contents ?? "")}
        </div>
      </div>`;

      titleContainer = html`<spk-internal-expandable-property-title-container
        .onSizeChanged=${this.handleTitleContainerSizeChanged}
      >
        <div class="propertyTitleContainer">
          ${titlePrefix}
          ${this.multiline
            ? html`
                <div class="typeInnerContainer typeInnerContainerInline">
                  ${this.typeInfo.label}
                </div>
              `
            : typeContainer}
        </div>
      </spk-internal-expandable-property-title-container>`;

      propertyCell = propertyCell = html`
        ${this.multiline
          ? html`
              <spk-internal-connecting-cell
                bottom="${frontmatterConnection}"
                top="${frontmatterConnection}"
                right="none"
              >
                ${typeContainer}
              </spk-internal-connecting-cell>
            `
          : nothing}
        ${frontmatter}
      `;
    }

    const measureContainer = html`
      <!-- This offscreen measure is used to determine the width of a character,
      for use in multiline type computation -->
      <div
        class="offscreenMeasureContainer"
        ref="${ref(this.offscreenTextSizeMeasureContainerRef)}"
      >
        A
      </div>

      <!-- This offscreen measure is used to determine the width of the single
      line type, for use in determining if we need to split the type into
      multiple lines -->
      <div
        class="offscreenMeasureContainer"
        ref="${ref(this.offscreenTypeMeasureContainerRef)}"
      >
        ${this.singleLineDisplayType.measure}
      </div>
    `;

    const hasExpandableContent =
      !!this.hasDescription ||
      !!this.hasExamples ||
      !!this.hasDefaultValue ||
      !!this.hasEmbed ||
      !!this.hasBreakouts;
    return html`<div data-testid=${this.id} class="entryContainer">
      <div class="entryHeaderContainer">
        ${hasExpandableContent
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
