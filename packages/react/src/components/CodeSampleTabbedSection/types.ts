import type { PropsWithChildren } from "react";

export type CodeSampleTabbedSectionProps = {
  /**
   * The children of the tabbed section. This will always be an array of
   * `CodeSampleTab` components, so we don't use the typical PropsWithChildren`.
   */
  children: React.ReactElement<CodeSampleTabProps>[];
};

export type CodeSampleTabProps = PropsWithChildren<{
  /**
   * The DOM ID of the code sample tab.
   */
  id: string;
  /**
   * The slot of the code sample tab, and will always be set to "tab". This property
   * exists to allow our runtime hooks to find these slots.
   */
  slot: "tab";
  /**
   * Tags to apply to the code sample tab and are used to convey metadata about
   * the tab. As an example, these can be used to get tabs for a specific
   * code sample type, and control them externally.
   *
   * Current tags are:
   * - codeSample: `${language}`
   */
  tags: Record<string, string>;
}>;
