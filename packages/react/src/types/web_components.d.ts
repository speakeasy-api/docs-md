// We need to use interfaces so we can take advantage of interface merging
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { DetailedHTMLProps, HTMLAttributes } from "react";

import type { PillElement } from "../components/Pill/Pill.tsx";
import type { PillProps } from "../components/Pill/types.ts";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      ["spk-pill"]: PillProps &
        DetailedHTMLProps<HTMLAttributes<PillElement & PillProps>, PillElement>;
    }
  }
}
