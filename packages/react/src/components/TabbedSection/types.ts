import type { FC } from "react";

import type { SectionProps } from "../Section/types.ts";
import type { SectionContentProps } from "../SectionContent/types.ts";
import type { SectionTabProps } from "../SectionTab/types.ts";
import type { SectionTitleProps } from "../SectionTitle/types.ts";
import type { TabButtonProps } from "../TabButton/types.ts";

export type TabbedSectionProps = {
  /**
   * The children of the tabbed section. This will always be an array of
   * `SectionTab` components, so we don't use the typical PropsWithChildren`.
   */
  children: React.ReactElement<SectionTabProps>[];

  /**
   * The component to use for rendering the base section. Defaults to
   * `Section`. If you override the default Section implementation, then pass
   * your custom implementation in here too. Otherwise, the default Section
   * implementation will be used internally.
   */
  Section?: FC<SectionProps>;
  /**
   * The component to use for rendering the section content. Defaults to
   * `SectionContent`. If you override the default SectionContent implementation,
   * then pass your custom implementation in here too. Otherwise, the default
   * SectionContent implementation will be used internally.
   */
  SectionContent?: FC<SectionContentProps>;
  /**
   * The component to use for rendering the section title. Defaults to
   * `SectionTitle`. If you override the default SectionTitle implementation,
   * then pass your custom implementation in here too. Otherwise, the default
   * SectionTitle implementation will be used internally.
   */
  SectionTitle?: FC<SectionTitleProps>;

  /**
   * The component to use for rendering the tab button. Defaults to
   * `TabButton`. If you override the default TabButton implementation, then
   * pass your custom implementation in here too. Otherwise, the default
   * TabButton implementation will be used internally.
   */
  TabButton?: FC<TabButtonProps>;
};
