import type { PropsWithChildren } from "react";

import type { SectionVariant } from "../../../renderers/base/base.ts";

export type SectionProps = PropsWithChildren<{
  title: string | React.ReactNode;
  id?: string;
  variant: SectionVariant;
  className?: string;
}>;
