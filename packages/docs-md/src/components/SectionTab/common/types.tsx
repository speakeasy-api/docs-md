import type { PropsWithChildren } from "react";

export type SectionTabProps = PropsWithChildren<{
  id: string;
  slot: "tab";
}>;
