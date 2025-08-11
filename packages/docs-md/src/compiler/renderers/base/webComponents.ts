import type {
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

  protected override handleCreateBreakouts(cb: () => void) {
    this.appendText("<speakeasy-expandable-section>");
    cb();
    this.appendText("</speakeasy-expandable-section>");
  }
}
