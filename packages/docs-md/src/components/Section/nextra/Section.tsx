import { Card } from "../../primitives/nextra/Card.tsx";
import type { SectionProps } from "../common/types.ts";

export function NextraSection({ title, children, id }: SectionProps) {
  return (
    <Card>
      <div id={id}>
        <div>{title}</div>
      </div>
      <div>{children}</div>
    </Card>
  );
}
