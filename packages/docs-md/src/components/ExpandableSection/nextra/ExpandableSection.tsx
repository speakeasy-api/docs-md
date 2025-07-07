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

  return (
    <div
      className="x:rounded x:border x:border-gray-200 x:bg-white x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900"
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
        className="x:rounded x:border x:border-gray-200 x:bg-white x:py-1 x:px-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900 x:relative x:w-fit x:flex x:items-center x:font-bold"
        style={{
          // TODO: For some reason, these styles just _refuse_ to stick when
          // using Tailwind classes, so for now I just hard-code the style
          top: "-1rem",
          left: "0.5rem",
          gap: "0.25rem 0.5rem",
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
        className="x:px-3 x:pb-2"
        style={{
          display: isOpen ? "block" : "none",
          // TODO: animate height when expanding closing. Requires knowing the
          // height up front though it seems.

          // TODO: this margin also refuses to stick when using Tailwind
          // classes. This margin exists to counteract the margin-top on the
          // first element inside the expandable section, which causes an ugly
          // gap when the section is expanded.
          marginTop: "-2rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}
