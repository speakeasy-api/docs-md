import type { Settings } from "../types/settings.ts";
import { getDocsData } from "./docsData/getDocsData.ts";
import { generateContent } from "./mdx/generateContent.ts";

/**
 * Given an OpenAPI spec, generate Markdown pages of the spec. The returned
 * object is a map of page filenames to page contents.
 */
export async function generatePages({
  specContents,
  settings,
}: {
  specContents: string;
  settings: Settings;
}): Promise<Record<string, string>> {
  const data = await getDocsData(specContents);
  return generateContent({ data, settings });
}
