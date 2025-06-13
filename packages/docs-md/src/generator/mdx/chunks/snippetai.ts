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
  renderer.insertComponentImport("SnippetAI", "SnippetAI/index.js");
  renderer.appendHeading(1, "Snippet AI");
  renderer.appendHeading(2, "Hit cmd/ctrl + k to open SnippetAI");
  renderer.appendRaw(`
<SnippetAI
  codeLang="typescript"${suggestions ? `\n  suggestions={${JSON.stringify(suggestions)}}` : ""}
  publishingToken="${apiKey}"
/>
`);
  renderer.appendParagraph(
    "This page is a very early technology demonstration of SnippetAI. SnippetAI is currently displayed in modal form for historical reasons, but will be displayed directly on the page soon."
  );
}
