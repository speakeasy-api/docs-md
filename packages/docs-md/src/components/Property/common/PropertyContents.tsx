"use client";

import type {
  FC,
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react";
import { useMemo } from "react";
import useMeasure from "react-use-measure";

import type { DisplayTypeInfo } from "../../../renderers/base/base.ts";
import type { PillProps } from "../../Pill/common/types.ts";
import type { PropertyProps } from "./types.ts";

function computeSingleLineDisplayType(typeInfo: DisplayTypeInfo): {
  measure: string;
  display: string;
} {
  switch (typeInfo.label) {
    case "array":
    case "map":
    case "set": {
      const children = typeInfo.children.map(computeSingleLineDisplayType);
      return {
        measure: `${typeInfo.label}<${children.map((c) => c.measure).join(",")}>`,
        display: `${typeInfo.label}&lt;${children.map((c) => c.display).join(",")}&gt;`,
      };
    }
    case "union":
    case "enum": {
      const children = typeInfo.children.map(computeSingleLineDisplayType);
      return {
        measure: children.map((c) => c.measure).join(" | "),
        display: children.map((c) => c.display).join(" | "),
      };
    }
    default: {
      return {
        measure: typeInfo.label,
        display: typeInfo.linkedLabel,
      };
    }
  }
}

type MultilineTypeLabelEntry = {
  contents: string;
  multiline: boolean;
};

function computeMultilineTypeLabel(
  typeInfo: DisplayTypeInfo,
  indentation: number,
  maxCharacters: number
): MultilineTypeLabelEntry {
  switch (typeInfo.label) {
    case "array":
    case "map":
    case "set": {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeInfo);
      if (singleLineContents.measure.length < maxCharacters - indentation) {
        return {
          contents: singleLineContents.display,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeInfo.children) {
        children.push(
          computeMultilineTypeLabel(child, indentation + 2, maxCharacters)
        );
      }

      let contents = `${typeInfo.label}&lt;<br />`;
      for (const child of children) {
        contents += `${"&nbsp;".repeat(indentation + 2)}${child.contents}<br />`;
      }
      contents += `${"&nbsp;".repeat(indentation)}&gt;`;
      return {
        contents,
        multiline: true,
      };
    }
    case "union":
    case "enum": {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeInfo);
      if (singleLineContents.measure.length < maxCharacters - indentation) {
        return {
          contents: singleLineContents.display,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeInfo.children) {
        children.push(computeMultilineTypeLabel(child, 0, maxCharacters));
      }

      let contents = "";
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        // If this is the first child, then we've already applied padding from
        // the parent before getting here.
        const prefix = i > 0 ? "&nbsp;".repeat(indentation) : "";

        // If this is the last child, then we don't need a trailing newline
        // since it will be appended by the parent
        const suffix = i < children.length - 1 ? "<br />" : "";

        // Will never be undefined given how the loop/array is constructed
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        contents += `${prefix}| ${child!.contents}${suffix}`;
      }
      return {
        contents,
        multiline: true,
      };
    }
    default: {
      return {
        contents: typeInfo.linkedLabel,
        multiline: false,
      };
    }
  }
}

type PropertyContentsProps = PropertyProps & {
  OuterContainer: ForwardRefExoticComponent<
    PropsWithChildren<{ multiline: boolean }> & RefAttributes<HTMLDivElement>
  >;
  TitleContainer: ForwardRefExoticComponent<
    PropsWithChildren & RefAttributes<HTMLSpanElement>
  >;
  TypeContainer: ForwardRefExoticComponent<
    {
      multiline: boolean;
      contents: string;
    } & RefAttributes<HTMLDivElement>
  >;
  OffscreenMeasureContainer: ForwardRefExoticComponent<
    RefAttributes<HTMLDivElement>
  >;
  Pill: FC<PillProps>;
};

export function PropertyContents({
  children,
  typeInfo,
  typeAnnotations,
  OuterContainer,
  TitleContainer,
  TypeContainer,
  OffscreenMeasureContainer,
  Pill,
}: PropertyContentsProps) {
  // We measure the outer container, the title, and the type container so that
  // we can determine if and how to split the type display into multiple lines
  // We alias the bounds so the useMemo isn't affected by non-width bounds
  // changing (or reference instability)
  const [titleContainerRef, titleContainerBounds] = useMeasure();
  const titleContainerWidth = titleContainerBounds.width;
  const [typeContainerRef, typeContainerBounds] = useMeasure();
  const typeContainerWidth = typeContainerBounds.width;
  const [outerContainerRef, outerContainerBounds] = useMeasure();
  const outerContainerWidth = outerContainerBounds.width;
  const [offscreenMeasureContainerRef, offscreenMeasureContainerBounds] =
    useMeasure();
  const offscreenMeasureContainerWidth = offscreenMeasureContainerBounds.width;

  const { multiline, contents } = useMemo(() => {
    const { display, measure } = computeSingleLineDisplayType(typeInfo);

    // If the value is 0, that means we haven't rendered yet and don't know the
    // width. In this case, we just don't render the type at all.
    if (offscreenMeasureContainerWidth === 0) {
      return {
        multiline: false,
        contents: "",
      };
    }

    // Compute the width take by the type on a single line, and whether or not
    // we need to split the type into a separate line from the title
    const singleLineWidth =
      measure.length * offscreenMeasureContainerWidth + titleContainerWidth;
    const multiline = singleLineWidth > outerContainerWidth;

    // If the measured width is 0, that means we're running on the server in which
    // case we want to render content on a single line. We only need maxCharacters
    // in the multiline case, so we don't need to consider the title width when
    // computing max characters.
    const maxCharacters =
      typeContainerWidth === 0 || offscreenMeasureContainerWidth === 0
        ? Infinity
        : // We subtract 4 here to account for the padding on the left and right
          Math.floor(typeContainerWidth / offscreenMeasureContainerWidth) - 4;

    // Finally, if we are multiline, compute the multiline type label, otherwise
    // we can reuse the single line version we already computed
    const contents = multiline
      ? computeMultilineTypeLabel(typeInfo, 0, maxCharacters).contents
      : display;

    return {
      multiline,
      contents,
    };
  }, [
    typeInfo,
    titleContainerWidth,
    typeContainerWidth,
    outerContainerWidth,
    offscreenMeasureContainerWidth,
  ]);

  return (
    <OuterContainer ref={outerContainerRef} multiline={multiline}>
      <TitleContainer ref={titleContainerRef}>
        {children}
        {typeAnnotations.map((annotation) => (
          <Pill key={annotation.title} variant={annotation.variant}>
            {annotation.title}
          </Pill>
        ))}
      </TitleContainer>
      <div ref={typeContainerRef}>
        <TypeContainer
          multiline={multiline}
          ref={typeContainerRef}
          contents={contents}
        />
      </div>
      <OffscreenMeasureContainer ref={offscreenMeasureContainerRef} />
    </OuterContainer>
  );
}
