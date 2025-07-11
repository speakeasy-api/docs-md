import type { PropsWithChildren } from "react";

import type { SectionVariant } from "../../../renderers/base/base.ts";

export type SectionContentProps = PropsWithChildren<{
  variant: SectionVariant;
}>;
