import type { PropsWithChildren } from "react";

import type { SectionContentBorderVariant } from "../../../renderers/base/base.ts";

export type SectionProps = PropsWithChildren<{
  contentBorderVariant: SectionContentBorderVariant;

  // Internal property used by ExpandableSection
  noTopBorderRadius?: boolean;
}>;
