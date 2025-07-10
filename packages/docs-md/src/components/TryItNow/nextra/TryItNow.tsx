"use client";
import { useTheme } from "next-themes";
import { useMounted } from "nextra/hooks";

import { Content } from "../common/components/Content.tsx";
import type { NextraTryItNowProps } from "../common/types.ts";

const TryItNowContents = ({
  nextraCodeThemes = {
    dark: "dark",
    light: "light",
  },
  ...props
}: NextraTryItNowProps) => {
  const { resolvedTheme } = useTheme();
  const sandpackTheme = nextraCodeThemes[resolvedTheme as "dark" | "light"];

  return <Content theme={sandpackTheme} {...props} />;
};

export const TryItNowNextra = (props: NextraTryItNowProps) => {
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
