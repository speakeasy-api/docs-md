import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "x:not-first:mt-4 x:rounded x:border x:border-gray-200 x:bg-white x:m-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900",
        className
      )}
      style={{ padding: "0.5rem 0.75rem" }}
    >
      {children}
    </div>
  );
}
