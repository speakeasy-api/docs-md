import type { PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<{
  onClick: () => void;
  className?: string;
}>;
