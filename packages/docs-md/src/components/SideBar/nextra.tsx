// IMPORTANT! This file MUST NOT be marked as "use client", otherwise it will
// cause Nextra to error when trying to render. This is because MDX files cannot
// import files marked with "use client", for some reason, but it's perfectly
// happy to import a server component (this file) that then imports a client
// component.

import type { SideBarTriggerProps } from "./common/containers.tsx";
import {
  SideBarContents,
  SideBarTriggerContents,
} from "./common/containers.tsx";
import { NextraSideBar } from "./nextra/sidebar.tsx";
import { NextraSideBarTrigger } from "./nextra/sidebarTrigger.tsx";

export function SideBar() {
  return <SideBarContents SideBarContainer={NextraSideBar} />;
}

export function SideBarTrigger(props: SideBarTriggerProps) {
  return <SideBarTriggerContents {...props} Button={NextraSideBarTrigger} />;
}
