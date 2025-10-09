// This file is really acting like a .d.ts file, but we have it in a standard
// TypeScript file so we can import it in index.ts, which makes this available
// to all of our consumers too. We can't do that with a .d.ts file.
/* eslint-disable @typescript-eslint/no-namespace */
// We need to use interfaces so we can take advantage of interface merging
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { DetailedHTMLProps, HTMLAttributes } from "react";

import type { PillElement, PillProps } from "../components/Pill/Pill.tsx";

type ReactCustomElement<Element extends HTMLElement, Props> = Props &
  DetailedHTMLProps<HTMLAttributes<Element & Props>, Element>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      ["spk-pill"]: ReactCustomElement<PillElement, PillProps>;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "spk-pill": PillElement;
  }
}
