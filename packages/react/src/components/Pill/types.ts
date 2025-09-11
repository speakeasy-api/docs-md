import type { PropsWithChildren } from "react";

import type { PillVariant } from "../../../types/shared.ts";

export type PillProps = PropsWithChildren<{
  /**
   * The variant to use for the pill, one of:
   * - "error"
   * - "warning"
   * - "info"
   * - "success"
   * - "primary"
   * - "secondary"
   */
  variant: PillVariant;
}>;
