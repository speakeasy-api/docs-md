import { useCallback, useEffect, useState } from "react";

import type { ExpandableSectionProps } from "./types.ts";

export function DocusaurusExpandableSection({
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

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "var(--ifm-hero-background-color)",
        color: "var(--ifm-hero-text-color)",
        border:
          "var(--ifm-global-border-width) solid var(--ifm-blockquote-border-color)",
        borderRadius: "var(--ifm-global-radius)",
        boxShadow: "var(--ifm-global-shadow-tl)",
        margin: "2rem 0 1rem 0",

        transition: "height 0.2s ease-in-out",

        // TODO: this is a magic number I found by trial and error. I don't know
        // why it's needed, but without it we don't scroll to the right place.
        // This may not be consistent across different Docusaurus instances
        scrollMarginTop: "6rem",
      }}
      id={id}
    >
      <button
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
        </div>{" "}
        {title}
      </button>
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
