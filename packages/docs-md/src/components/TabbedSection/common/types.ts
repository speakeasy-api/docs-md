import type { PropsWithChildren } from "react";

export type TabbedSectionProps = {
  title: string;
  id?: string;
  children: React.ReactElement<{ title: string; tooltip?: string }>[];
};
export type HeaderContainerProps = PropsWithChildren<{
  title: string;
  id?: string;
}>;
export type TabButtonProps = {
  title: string;
  tooltip?: string;
  isActive: boolean;
  onClick: () => void;
};
