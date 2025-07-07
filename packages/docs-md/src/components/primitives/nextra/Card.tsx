import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="x:not-first:mt-4 x:rounded x:border x:border-gray-200 x:bg-white x:p-2 x:m-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900">
      {children}
    </div>
  );
}
