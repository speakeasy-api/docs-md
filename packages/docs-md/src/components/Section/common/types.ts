import type { SectionVariant } from "../../../renderers/base/base.ts";

export type SectionProps = {
  variant: SectionVariant;
  className?: string;
  children: [React.ReactNode, React.ReactNode];
};
