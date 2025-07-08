import { Card } from "../../primitives/nextra/Card.tsx";
import type { SectionProps } from "../common/types.ts";

export function NextraSection({ title, children, id }: SectionProps) {
  return (
    <Card>
      <h3
        id={id}
        className="x:tracking-tight x:text-slate-900 x:dark:text-slate-100 x:font-semibold x:target:animate-[fade-in_1.5s] x:text-2xl x:border-b nextra-border"
        style={{
          // TODO: why does `x:pb-3` apply a padding?
          paddingBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <div>{children}</div>
    </Card>
  );
}
