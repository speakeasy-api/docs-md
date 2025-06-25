"use client";

import type { PropsWithChildren } from "react";
import React from "react";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};

const BASE_BUTTON_CLASS =
  "x:focus-visible:nextra-focus x:cursor-pointer x:transition-colors x:border x:border-gray-200 x:hover:bg-gray-100 x:dark:hover:bg-neutral-800 x:select-none x:rounded x:flex x:items-center";

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
        <button
          onClick={closeRequest}
          className={BASE_BUTTON_CLASS}
          // For some bizarre reason, setting the class `x:px-1` on this button
          // doesn't work, even though it does below and other classes work here
          style={{ padding: "0 8px" }}
        >
          X
        </button>
      </div>
      {content?.content}
    </div>
  );
}

export function NextraSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className={`${BASE_BUTTON_CLASS} x:px-2 x:py-1 x:my-3`}
    >
      {children}
    </button>
  );
}
