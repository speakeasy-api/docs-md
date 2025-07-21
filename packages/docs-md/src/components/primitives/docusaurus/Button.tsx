import type { ButtonProps } from "../types.ts";

export function Button({ className, onClick, children }: ButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
