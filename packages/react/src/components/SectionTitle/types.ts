import type { PropsWithChildren } from "react";

export type SectionTitleProps = PropsWithChildren<{
  id?: string;
  slot: "title";
}>;
