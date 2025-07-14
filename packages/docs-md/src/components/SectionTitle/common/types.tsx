import type { PropsWithChildren } from "react";

import type {
  SectionTitleBorderVariant,
  SectionTitlePaddingVariant,
} from "../../../renderers/base/base.ts";

export type SectionTitleProps = PropsWithChildren<{
  borderVariant: SectionTitleBorderVariant;
  paddingVariant: SectionTitlePaddingVariant;
  slot: "title";
}>;
