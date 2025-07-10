import type { PropsWithChildren } from "react";

export type TitleProps = {
  slot: "title";
};

export type TabProps = {
  slot: "tab";
  title: string;
  "data-tab-id": string;
};

export type ContentProps = {
  slot: "content";
  "data-tab-content-id": string;
};

export type TabbedSectionProps = {
  children: React.ReactElement<TitleProps | TabProps | ContentProps>[];
};

export type HeaderContainerProps = {
  children: [React.ReactElement<TitleProps>, ...React.ReactElement[]];
};
export type TabButtonProps = PropsWithChildren<{
  title: string;
  isActive: boolean;
  onClick: () => void;
}>;
