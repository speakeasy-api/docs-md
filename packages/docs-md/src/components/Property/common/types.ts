import type { PropsWithChildren } from "react";

import type {
  PropertyAnnotations,
  TypeInfo,
} from "../../../renderers/base/base.ts";

export type PropertyProps = PropsWithChildren<{
  typeInfo: TypeInfo;
  typeAnnotations: PropertyAnnotations[];
}>;
