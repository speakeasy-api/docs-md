// We need to use interfaces so we can take advantage of interface merging
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { DetailedHTMLProps, HTMLAttributes } from "react";

import type { PillElement } from "../components/Pill/Pill.tsx";
import type { PillProps } from "../components/Pill/types.ts";

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
