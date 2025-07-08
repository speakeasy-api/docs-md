import type { HeaderContainerProps } from "../common/types.ts";

export function HeaderContainer({ title, children, id }: HeaderContainerProps) {
  return (
    <div
      className="x:border-b nextra-border"
      style={{
        // TODO: more styles that aren't compiled
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <h3
        id={id}
        className="x:tracking-tight x:text-slate-900 x:dark:text-slate-100 x:font-semibold x:target:animate-[fade-in_1.5s] x:text-2xl"
        style={{
          // TODO: more styles that aren't compiled
          paddingBottom: "0.5rem",
          flexGrow: 1,
        }}
      >
        {title}
      </h3>
      <div
        style={{
          // TODO: more styles that aren't compiled
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}
