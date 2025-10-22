import type { PropsWithChildren } from "react";

export type ResponseTabbedSectionProps = {
  /**
   * The children of the tabbed section. This will always be an array of
   * `ResponseTab` components, so we don't use the typical PropsWithChildren`.
   */
  children: React.ReactElement<ResponseTabProps>[];
};

export type ResponseTabProps = PropsWithChildren<{
  /**
   * The DOM ID of the response tab.
   */
  id: string;
  /**
   * The slot of the response tab, and will always be set to "tab". This property
   * exists to allow our runtime hooks to find these slots.
   */
  slot: "tab";
  /**
   * Tags to apply to the response tab and are used to convey metadata about
   * the tab. As an example, these can be used to get tabs for a specific
   * response type, and control them externally.
   *
   * Current tags are:
   * - response: `${statusCode}:${contentType}`
   */
  tags: Record<string, string>;
}>;
