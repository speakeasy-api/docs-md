import type {
  RendererCreateCodeSamplesSectionArgs,
  SiteGetRendererArgs,
} from "./base.ts";
import { MarkdownRenderer, MarkdownSite } from "./markdown.ts";

export class LLMSite extends MarkdownSite {
  protected override getRenderer(...[options]: SiteGetRendererArgs) {
    return new LLMRenderer({ ...options });
  }
}

class LLMRenderer extends MarkdownRenderer {
  createCodeSamplesSection(..._: RendererCreateCodeSamplesSectionArgs) {
    // TODO
  }
}
