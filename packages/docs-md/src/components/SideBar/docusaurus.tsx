"use client";

import type { PropsWithChildren } from "react";
import React from "react";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};

export function DocusaurusSideBar({
  content,
  closeRequest,
}: {
  content: SidebarContent;
  closeRequest: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--ifm-hero-background-color)",
        color: "var(--ifm-hero-text-color)",
        border:
          "var(--ifm-global-border-width) solid var(--ifm-blockquote-border-color)",
        borderRadius: "var(--ifm-global-radius)",
        boxShadow: "var(--ifm-global-shadow-tl)",
        padding:
          "var(--ifm-alert-padding-vertical) var(--ifm-alert-padding-horizontal)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            // Note: the docs at https://docusaurus.community/knowledge/design/css/variables/ say this variable
            // should be `--ifm-heading-h3-font-size`, but it doesn't exist. It's `--ifm-h3-font-size` instead.
            fontSize: "var(--ifm-h3-font-size)",
          }}
        >
          {content?.title}
        </div>
        <button onClick={closeRequest}>X</button>
      </div>
      <hr
        style={{
          height: "1px",
          backgroundColor: "var(--ifm-breadcrumb-color-active)",
        }}
      />
      {content?.content}
    </div>
  );
}

export function DocusaurusSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
      }}
    >
      {children}
    </button>
  );
}
