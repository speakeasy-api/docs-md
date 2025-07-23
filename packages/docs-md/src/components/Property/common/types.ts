import type { PropsWithChildren } from "react";

import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "../../../renderers/base/base.ts";

export type PropertyProps = PropsWithChildren<{
  typeInfo: DisplayTypeInfo;
  typeAnnotations: PropertyAnnotations[];
}>;
