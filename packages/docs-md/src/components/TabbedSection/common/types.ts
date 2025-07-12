import type { PropsWithChildren } from "react";

import type { SectionTabProps } from "../../SectionTab/common/types.tsx";

export type TabbedSectionProps = {
  children: React.ReactElement<SectionTabProps>[];
};

export type TabButtonProps = PropsWithChildren<{
  isActive: boolean;
  onClick: () => void;
}>;
