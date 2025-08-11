import { HEADINGS } from "../../content/constants.ts";
import type {
  RendererAddExpandableBreakoutArgs,
  RendererAddExpandablePropertyArgs,
  RendererCreatePillArgs,
  RendererCreateSectionArgs,
  RendererCreateSectionContentArgs,
  RendererCreateSectionTitleArgs,
  RendererCreateTabbedSectionTabArgs,
} from "./base.ts";
import { MarkdownRenderer, MarkdownSite } from "./markdown.ts";

export abstract class WebComponentSite extends MarkdownSite {
  // There isn't any difference between MdxSite and MarkdownSite at the moment,
  // but we still want the named class for consistency
}

export abstract class WebComponentRenderer extends MarkdownRenderer {
  #frontMatter = "";

  public override render() {
    const parentData = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") + parentData;
    return data;
  }

  public override createPillStart(...[variant]: RendererCreatePillArgs) {
    return `<speakeasy-pill variant="${variant}">`;
  }

  public override createPillEnd() {
    return "</speakeasy-pill>";
  }

  public override createSectionStart(
    ...[{ variant = "default" } = {}]: RendererCreateSectionArgs
  ) {
    return `<speakeasy-section variant="${variant}">`;
  }

  public override createSectionEnd() {
    return "</speakeasy-section>";
  }

  public override createSectionTitleStart(
    ...[
      { variant = "default", slot = "title" } = {},
    ]: RendererCreateSectionTitleArgs
  ) {
    return `<speakeasy-section-title slot="${slot}" variant="${variant}">`;
  }

  public override createSectionTitleEnd() {
    return `</speakeasy-section-title>`;
  }

  public override createSectionContentStart(
    ...[
      { variant = "default", id, slot = "content" } = {},
    ]: RendererCreateSectionContentArgs
  ) {
    return `<speakeasy-section-content slot="${slot}" variant="${variant}"${
      id ? ` id="${id}"` : ""
    }>`;
  }

  public override createSectionContentEnd() {
    return `</speakeasy-section-content>`;
  }

  public override createTabbedSectionStart() {
    return `<speakeasy-tabbed-section>`;
  }

  public override createTabbedSectionEnd() {
    return "</speakeasy-tabbed-section>";
  }

  public override createTabbedSectionTabStart(
    ...[id]: RendererCreateTabbedSectionTabArgs
  ) {
    return `<speakeasy-section-tab slot="tab" id="${id}">`;
  }

  public override createTabbedSectionTabEnd() {
    return "</speakeasy-section-tab>";
  }

  public override getIdSeparator() {
    return "_";
  }

  public override addExpandableBreakout(
    ...[{ createTitle, createContent }]: RendererAddExpandableBreakoutArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.appendText(
      `<speakeasy-expandable-breakout
    slot="entry"
    id="${id}"
    headingId="${this.getCurrentId()}"${parentId ? ` parentId="${parentId}"` : ""}
    hasFrontMatter={${createContent ? "true" : "false"}}
  >`,
      { escape: "none" }
    );

    this.appendText(`<div slot="title">`);
    createTitle();
    this.appendText("</div>");

    if (createContent) {
      this.appendText(`<div slot="content">`);
      createContent();
      this.appendText("</div>");
    }

    this.appendText("</speakeasy-expandable-breakout>");
  }

  public override addExpandableProperty(
    ...[
      { typeInfo, annotations, title, createContent },
    ]: RendererAddExpandablePropertyArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.appendText(
      `<speakeasy-expandable-property slot="entry" id="${id}" headingId="${this.getCurrentId()}"${
        parentId ? ` parentId="${parentId}"` : ""
      }${
        typeInfo
          ? ` typeInfo="${JSON.stringify(typeInfo).replaceAll('"', "&quot;")}"`
          : ""
      }${
        annotations.length > 0
          ? ` typeAnnotations="${JSON.stringify(annotations).replaceAll('"', "&quot;")}"`
          : ""
      } hasFrontMatter="${createContent ? "true" : "false"}">`,
      { escape: "none" }
    );

    this.appendText(`<div slot="title">`);
    this.appendHeading(HEADINGS.PROPERTY_HEADING_LEVEL, title, {
      escape: "mdx",
      id: this.getCurrentId(),
    });
    this.appendText("</div>");

    if (createContent) {
      this.appendText(`<div slot="content">`);
      createContent();
      this.appendText("</div>");
    }

    this.appendText(`</speakeasy-expandable-property>`);
  }

  #getBreakoutIdInfo() {
    const stack = this.getContextStack().map((c) => c.id);
    const id = stack.join("_");
    const parentId = stack.slice(0, -1).join("_") || undefined;
    return { id, parentId };
  }

  protected override handleCreateSecurity(cb: () => void) {
    this.appendText("<speakeasy-expandable-section>");
    cb();
    this.appendText("</speakeasy-expandable-section>");
  }

  protected override handleCreateParameters(cb: () => void) {
    this.appendText("<speakeasy-expandable-section>");
    cb();
    this.appendText("</speakeasy-expandable-section>");
  }

  protected override handleCreateBreakouts(cb: () => void) {
    this.appendText("<speakeasy-expandable-section>");
    cb();
    this.appendText("</speakeasy-expandable-section>");
  }
}
