import type { PropsWithChildren } from "react";

export type ExpandableSectionProps = PropsWithChildren<{
  title: string;
  id?: string;
}>;
