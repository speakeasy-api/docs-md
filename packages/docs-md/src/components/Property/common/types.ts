import type { PropsWithChildren } from "react";

import type { TypeInfo } from "../../../renderers/base/base.ts";

export type PropertyProps = PropsWithChildren<{
  typeInfo: TypeInfo;
}>;
