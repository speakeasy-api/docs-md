import type { SectionTabProps } from "../SectionTab/types.ts";

export type TabbedSectionProps = {
  /**
   * The children of the tabbed section. This will always be an array of
   * `SectionTab` components, so we don't use the typical PropsWithChildren`.
   */
  children: React.ReactElement<SectionTabProps>[];
};
