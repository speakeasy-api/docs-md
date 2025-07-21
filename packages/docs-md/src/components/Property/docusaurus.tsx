import { Pill } from "../Pill/Pill.tsx";
import { PropertyContents } from "./common/PropertyContents.tsx";
import type { PropertyProps } from "./common/types.ts";
import {
  OffscreenMeasureContainer,
  OuterContainer,
  TitleContainer,
  TypeContainer,
} from "./docusaurus/Containers.tsx";

export function Property(props: PropertyProps) {
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
