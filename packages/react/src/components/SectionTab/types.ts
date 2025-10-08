import type { PropsWithChildren } from "react";

export type SectionTabProps = PropsWithChildren<{
  /**
   * The DOM ID of the section tab.
   */
  id: string;
  /**
   * The slot of the section tab, and will always be set to "tab". This property
   * exists to allow our runtime hooks to find these slots.
   */
  slot: "tab";
  /**
   * Tags to apply to the section tab and are used to convey metadata about
   * the tab. As an example, these can be used to get code sample tabs for a
   * specific language, and control them externally.
   *
   * Current tags are:
   * - response: `${statusCode}:${contentType}` on the Response section tabs
   * - responseExample: `${statusCode}:${contentType}` on the Response Example section tabs
   * - codeSample: `${language}` on the Code Sample section tabs
   */
  tags: Record<string, string>;
}>;
