"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "../../Button/nextra.tsx";
import type { ExpandableSectionProps } from "../common/types.ts";

export function NextraExpandableSection({
  title,
  id,
  children,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = useCallback(() => setIsOpen((prev) => !prev), []);

  // Open section when targeted by URL fragment, which happens when the user
  // clicks on a link in an inline type signature
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === id) {
        setIsOpen(true);
      }
    };

    // Check initial hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [id]);

  /*
  class="x:not-first:mt-4 x:rounded x:border x:border-gray-200 x:bg-white x:p-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900 x:overflow-hidden"
  */
  return (
    <div
      className="x:not-first:mt-4 x:rounded x:border x:border-gray-200 x:bg-white x:p-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900 x:overflow-hidden"
      style={{
        position: "relative",
        margin: "2rem 0 1rem 0",

        // TODO: this is a magic number I found by trial and error. I don't know
        // why it's needed, but without it we don't scroll to the right place.
        // This may not be consistent across different Docusaurus instances
        scrollMarginTop: "5rem",
      }}
      id={id}
    >
      <Button
        onClick={onClick}
        style={{
          top: "calc(-1 * var(--ifm-alert-padding-vertical))",
          left: "calc(0.5 * var(--ifm-alert-padding-horizontal))",
          position: "relative",
          border:
            "var(--ifm-global-border-width) solid var(--ifm-blockquote-border-color)",
          backgroundColor: "var(--ifm-hero-background-color)",
          borderRadius: "var(--ifm-global-radius)",
          padding: "0.5rem",
          width: "fit-content",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem 0.5rem",
          fontWeight: "bold",
          // Note: the docs at https://docusaurus.community/knowledge/design/css/variables/ say this variable
          // should be `--ifm-heading-h5-font-size`, but it doesn't exist. It's `--ifm-h5-font-size` instead.
          fontSize: "var(--ifm-h5-font-size)",
        }}
      >
        <div
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(90deg)",
            transition: "transform 0.2s ease-in-out",
          }}
        >
          ▲
        </div>
        {title}
      </Button>
      <div
        style={{
          padding: "0 calc(0.5 * var(--ifm-alert-padding-horizontal))",
          display: isOpen ? "block" : "none",
          // TODO: animate height when expanding closing. Requires knowing the
          // height up front though it seems.
        }}
      >
        {children}
      </div>
    </div>
  );
}
