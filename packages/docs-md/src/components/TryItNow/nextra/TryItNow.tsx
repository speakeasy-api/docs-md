"use client";
import { useTheme } from "next-themes";
import { useMounted } from "nextra/hooks";

import { Content } from "../common/components/Content.tsx";
import type { TryItNowProps } from "../common/types.ts";

const TryItNowContents = (props: TryItNowProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Content currentTheme={resolvedTheme as "dark" | "light"} {...props} />
  );
};

export const TryItNowNextra = (props: TryItNowProps) => {
  const isMounted = useMounted();
  if (!isMounted) return null;

  return (
    <div
      style={{
        marginTop: "calc(var(--x-spacing)* 4)",
      }}
    >
      <TryItNowContents {...props} />
    </div>
  );
};
