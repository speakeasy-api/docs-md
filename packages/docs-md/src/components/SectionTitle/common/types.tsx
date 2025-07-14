import type { PropsWithChildren } from "react";

import type {
  SectionTitleBorderVariant,
  SectionTitlePaddingVariant,
} from "../../../renderers/base/base.ts";

export type SectionTitleProps = PropsWithChildren<{
  id?: string;
  borderVariant: SectionTitleBorderVariant;
  paddingVariant: SectionTitlePaddingVariant;
  slot: "title";
}>;
