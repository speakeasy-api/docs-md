import type { PropertyProps } from "../common/types.ts";

export function DocusaurusProperty({ children, typeInfo }: PropertyProps) {
  return (
    <div>
      {children}
      {typeInfo.label}
    </div>
  );
}
