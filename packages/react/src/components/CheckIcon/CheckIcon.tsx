import type { CheckIconProps } from "../TryItNow/types.ts";

export function CheckIcon({ className, style }: CheckIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      width="100%"
      height="100%"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
