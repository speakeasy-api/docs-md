import { getDocsData } from "./docsData/getDocsData.ts";
import { generateContent } from "./mdx/generateContent.ts";

/**
 * Given an OpenAPI spec, generate Markdown pages of the spec. The returned
 * object is a map of page filenames to page contents.
 */
export async function generatePages({
  specContents,
  buildPagePath,
  baseComponentPath,
}: {
  specContents: string;
  buildPagePath: (slug: string) => string;
  baseComponentPath: string;
}): Promise<Record<string, string>> {
  const data = await getDocsData(specContents);
  return generateContent({ data, buildPagePath, baseComponentPath });
}
