import type { CodeProps } from "./common/types.ts";
import { NextraCode } from "./nextra/nextra.tsx";

export function Code(props: CodeProps) {
  return <NextraCode {...props} />;
}
