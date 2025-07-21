import type { PropsWithChildren } from "react";

import type {
  SectionContentBorderVariant,
  SectionContentPaddingVariant,
} from "../../renderers/base/base.ts";

export type SectionContentProps = PropsWithChildren<{
  id?: string;
  slot: "content";
  borderVariant: SectionContentBorderVariant;
  paddingVariant: SectionContentPaddingVariant;
}>;
