"use client";

import { Pill } from "../../Pill/nextra.tsx";
import { PropertyContents } from "../common/PropertyContents.tsx";
import type { PropertyProps } from "../common/types.ts";
import {
  OffscreenMeasureContainer,
  OuterContainer,
  TitleContainer,
  TypeContainer,
} from "./Containers.tsx";

export function NextraProperty(props: PropertyProps) {
  return (
    <PropertyContents
      {...props}
      OuterContainer={OuterContainer}
      TitleContainer={TitleContainer}
      TypeContainer={TypeContainer}
      OffscreenMeasureContainer={OffscreenMeasureContainer}
      Pill={Pill}
    />
  );
}
