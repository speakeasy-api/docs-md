import type { PillProps } from "../common/types.ts";

export function NextraPill({ variant, children }: PillProps) {
  return <span className={`pill pill-${variant}`}>{children}</span>;
}
