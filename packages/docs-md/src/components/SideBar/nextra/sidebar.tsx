"use client";

import React from "react";

import { Button } from "../../primitives/nextra/Button.tsx";
import { Card } from "../../primitives/nextra/Card.tsx";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};
export function NextraSideBar({
  content,
  closeRequest,
}: {
  content: SidebarContent;
  closeRequest: () => void;
}) {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 className="x:tracking-tight x:text-slate-900 x:dark:text-slate-100 x:font-semibold x:target:animate-[fade-in_1.5s] x:text-lg">
          {content?.title}
        </h4>
        <Button
          onClick={closeRequest}
          // For some bizarre reason, setting the class `x:px-1` on this button
          // doesn't work, even though it does below and other classes work here
          style={{ padding: "0 8px" }}
        >
          X
        </Button>
      </div>
      {content?.content}
    </Card>
  );
}
