// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// non-async server component (this file) that then imports a client component.

import { TryItNowContents } from "./components/TryItNowContents.tsx";
import type { TryItNowProps } from "./types.ts";

/**
 * Try It Now displays an interactive code playground that loads the TypeScript
 * code sample for an operation and allows users to modify and execute it.
 * Currently, Try It Now is based on Sandpack.
 */
export function TryItNow(props: TryItNowProps) {
  return <TryItNowContents {...props} />;
}
