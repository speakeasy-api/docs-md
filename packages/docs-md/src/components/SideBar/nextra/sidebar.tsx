"use client";

import React from "react";

import { Button } from "../../Button/nextra.tsx";

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
    <div className="x:not-first:mt-4 x:rounded x:border x:border-gray-200 x:bg-white x:p-2 x:m-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900 x:overflow-hidden">
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
    </div>
  );
}
