import React from "react";
import sidebarMetadata from "./sidebarMetadata.json";
import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        style={{
          flex: "0 1 400px",
          borderRight: "1px solid var(--speakeasy-border-color)",
          marginRight: "1rem",
          padding: "1rem",
          overflow: "auto",
        }}
      >
        <Sidebar sidebarMetadata={sidebarMetadata} pathPrefix="mistral" />
      </div>
      <div style={{ flex: "1 1 100%", overflow: "auto" }}>{children}</div>
    </>
  );
}
