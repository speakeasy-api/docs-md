// This file is really acting like a .d.ts file, but we have it in a standard
// TypeScript file so we can import it in index.ts, which makes this available
// to all of our consumers too. We can't do that with a .d.ts file.

// We need to use interfaces so we can take advantage of interface merging

import type { LitElement } from "lit";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export type LitProps<Element extends HTMLElement> = Omit<
  Element,
  keyof LitElement | "render" | "renderRoot"
>;

export type ReactCustomElement<Element extends HTMLElement> =
  LitProps<Element> &
    DetailedHTMLProps<HTMLAttributes<Element & LitProps<Element>>, Element>;
