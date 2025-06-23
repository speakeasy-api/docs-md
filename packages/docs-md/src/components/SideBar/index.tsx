"use client";

import { DocusaurusSideBar, DocusaurusSideBarCta } from "./docusaurus.tsx";
import { NextraSideBar, NextraSideBarCta } from "./nextra.tsx";

export const SideBar = {
  Docusaurus: DocusaurusSideBar,
  Nextra: NextraSideBar,
};

export const SideBarCta = {
  Docusaurus: DocusaurusSideBarCta,
  Nextra: NextraSideBarCta,
};
