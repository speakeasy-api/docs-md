import { useState } from "react";

import type { ExpandableSectionProps } from "./types.ts";

export function DocusaurusExpandableSection({
  title,
  children,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        }}
      >
        <div
          style={{
            fontWeight: "bold",
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
        }}
      >
        {children}
      </div>
    </div>
  );
}
