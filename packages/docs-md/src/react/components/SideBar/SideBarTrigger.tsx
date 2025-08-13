// IMPORTANT! This file MUST NOT be marked as "use client", otherwise it will
// cause Nextra to error when trying to render. This is because MDX files cannot
// import files marked with "use client", for some reason, but it's perfectly
// happy to import a server component (this file) that then imports a client
// component.

import {
  SideBarTriggerContents,
  type SideBarTriggerProps,
} from "./components/SideBarTriggerContents.tsx";

export function SideBarTrigger(props: SideBarTriggerProps) {
  return <SideBarTriggerContents {...props} />;
}
