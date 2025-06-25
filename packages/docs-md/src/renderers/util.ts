import { join } from "node:path";

import { getSettings } from "../util/settings.ts";

export function getEmbedPath(
  embedName: string,
  { extension = "mdx" }: { extension?: string } = {}
) {
  return join(
    getSettings().output.componentOutDir,
    "embeds",
    embedName + "." + extension
  );
}

export function getEmbedSymbol(embedName: string) {
  return `Embed${embedName}`;
}
