import type { PropsWithChildren } from "react";

import sectionStyles from "../../Section/docusaurus/styles.module.css";

export function ChildrenContainer({ children }: PropsWithChildren) {
  return <div className={sectionStyles.container}>{children}</div>;
}
