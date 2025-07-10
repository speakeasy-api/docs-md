import type { PropsWithChildren } from "react";

import type { SectionVariant } from "../../../renderers/base/base.ts";

export type SectionEntryProps = PropsWithChildren<{
  variant: SectionVariant;
}>;
