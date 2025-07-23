import type { PropsWithChildren } from "react";

import type { SectionTabProps } from "../../SectionTab/SectionTab.tsx";

export type TabbedSectionProps = {
  children: React.ReactElement<SectionTabProps>[];
};

export type TabButtonProps = PropsWithChildren<{
  isActive: boolean;
  onClick: () => void;
}>;
