"use client";
import { useMounted } from "nextra/hooks";
import { useEffect, useState } from "react";

import { Content } from "../common/components/Content.tsx";
import type { NextraTryItNowProps } from "../common/types.ts";
// Custom hook to listen for theme class changes
function useNextraThemeMode(mounted: boolean) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    // Initialize with current theme
    if (!mounted) return "light";
    if (document?.documentElement?.classList?.contains("dark")) return "dark";
    if (document?.documentElement?.classList?.contains("light")) return "light";
    return "light";
  });

  useEffect(() => {
    if (!mounted) return;
    const targetNode = document?.documentElement; // or document.body if that's where your classes are
    // Callback function to execute when mutations are observed
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

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, {
      attributes: true,
      attributeFilter: ["class"], // Only listen for class attribute changes
    });

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  return theme;
}

export const TryItNowNextra = ({ themes, ...props }: NextraTryItNowProps) => {
  const isMounted = useMounted();
  const themeMode = useNextraThemeMode(isMounted);

  const sandpackTheme = themes[themeMode];

  return (
    <Content
      theme={sandpackTheme}
      layoutStyle={{
        transition: "color 0.3s ease, background-color 0.3s ease",
      }}
      {...props}
    />
  );
};
