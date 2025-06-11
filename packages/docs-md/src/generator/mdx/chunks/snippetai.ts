import { getSettings } from "../../settings.ts";
import type { Renderer } from "../renderer.ts";

export function renderSnippetAI(renderer: Renderer) {
  const { snippetAI } = getSettings();
  if (!snippetAI) {
    throw new Error(
      "renderSnippetAI called without SnippetAI settings. This shouldn't be possible"
    );
  }
  const { suggestions, apiKey } = snippetAI;
  renderer.addNamedImport("@speakeasy-api/snippet-ai-react", "SnippetAI");
  renderer.appendHeading(1, "Snippet AI");
  renderer.appendRaw(`
<SnippetAI
  codeLang="typescript"${suggestions ? `\n  suggestions={${JSON.stringify(suggestions)}}` : ""}
  publishingToken="${apiKey}"
>
  <button>Open SnippetAI</button>
</SnippetAI>
`);
  renderer.appendParagraph(
    "SnippetAI support is an early work in progress. It will be displayed inline soon, not the dialog form it's currently in."
  );
}
