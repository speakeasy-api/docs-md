"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "../../primitives/nextra/Button.tsx";
import type { ExpandableSectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

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
    <div className={styles.container} id={id}>
      <Button onClick={onClick} className={styles.heading}>
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
        className={styles.contents}
        style={{
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
