import type { PillVariant } from "@speakeasy-api/docs-md-shared/types";
import type { PropsWithChildren } from "react";

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
