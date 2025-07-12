import type { PropsWithChildren } from "react";

import type {
  SectionContentBorderVariant,
  SectionContentPaddingVariant,
} from "../../../renderers/base/base.ts";

export type SectionContentProps = PropsWithChildren<{
  borderVariant: SectionContentBorderVariant;
  paddingVariant: SectionContentPaddingVariant;

  // Internal property used by ExpandableSection
  noBorderRadiusOnFirstElement?: boolean;
}>;
