// IMPORTANT! This file MUST NOT be marked as "use client", otherwise it will
// cause Nextra to error when trying to render. This is because MDX files cannot
// import files marked with "use client", for some reason, but it's perfectly
// happy to import a server component (this file) that then imports a client
// component.

import type { SideBarTriggerProps } from "./containers.tsx";
import { SideBarContents, SideBarTriggerContents } from "./containers.tsx";
import { DocusaurusSideBar, DocusaurusSideBarTrigger } from "./docusaurus.tsx";
import { NextraSideBar, NextraSideBarTrigger } from "./nextra.tsx";

export const SideBar = {
  Docusaurus: () => <SideBarContents SideBarContainer={DocusaurusSideBar} />,
  Nextra: () => <SideBarContents SideBarContainer={NextraSideBar} />,
};

export const SideBarTrigger = {
  Docusaurus: (props: SideBarTriggerProps) => (
    <SideBarTriggerContents {...props} Button={DocusaurusSideBarTrigger} />
  ),
  Nextra: (props: SideBarTriggerProps) => (
    <SideBarTriggerContents {...props} Button={NextraSideBarTrigger} />
  ),
};
