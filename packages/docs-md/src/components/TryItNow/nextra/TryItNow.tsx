"use client";
import { useMounted } from "nextra/hooks";
import { useEffect, useState } from "react";

import { Content } from "../common/components/Content.tsx";
import type { NextraTryItNowProps } from "../common/types.ts";

function useNextraThemeMode() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (document?.documentElement?.classList?.contains("dark")) {
      return "dark";
    } else if (document?.documentElement?.classList?.contains("light")) {
      return "light";
    }
    return "light";
  });

  useEffect(() => {
    const targetNode = document?.documentElement;
    const callback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const classList = targetNode?.classList;

          if (classList.contains("dark")) {
            setTheme("dark");
          } else if (classList.contains("light")) {
            setTheme("light");
          } else {
            setTheme("light");
          }
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}

const TryItNowContents = ({
  nextraCodeThemes = {
    dark: "dark",
    light: "light",
  },
  ...props
}: NextraTryItNowProps) => {
  const themeMode = useNextraThemeMode();
  const sandpackTheme = nextraCodeThemes[themeMode];

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
