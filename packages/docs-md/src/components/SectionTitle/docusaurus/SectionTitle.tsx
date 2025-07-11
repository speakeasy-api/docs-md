import type { SectionTitleProps } from "../common/types.tsx";

export function DocusaurusSectionTitle({ children }: SectionTitleProps) {
  // While it seems like this does nothing, having this as a proper React
  // component allows us to instrospect into what kind of component this is
  return <>{children}</>;
}
