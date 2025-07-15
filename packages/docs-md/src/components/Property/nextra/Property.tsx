import type { PropertyProps } from "../common/types.ts";

export function NextraProperty({ children, typeInfo }: PropertyProps) {
  return (
    <div>
      {typeInfo.label}
      {children}
    </div>
  );
}
