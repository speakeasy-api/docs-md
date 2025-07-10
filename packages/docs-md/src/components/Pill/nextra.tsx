import type { PillProps } from "./common/types.ts";
import { NextraPill } from "./nextra/Pill.tsx";

export function Pill(props: PillProps) {
  return <NextraPill {...props} />;
}
