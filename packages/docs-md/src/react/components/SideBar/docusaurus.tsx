import type { SideBarTriggerProps } from "./common/containers.tsx";
import {
  SideBarContents,
  SideBarTriggerContents,
} from "./common/containers.tsx";
import { DocusaurusSideBar } from "./docusaurus/sidebar.tsx";
import { DocusaurusSideBarTrigger } from "./docusaurus/sidebarTrigger.tsx";

export function SideBar() {
  return <SideBarContents SideBarContainer={DocusaurusSideBar} />;
}

export function SideBarTrigger(props: SideBarTriggerProps) {
  return (
    <SideBarTriggerContents {...props} Button={DocusaurusSideBarTrigger} />
  );
}
