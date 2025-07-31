"use client";

import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { forwardRef, useMemo } from "react";
import useMeasure from "react-use-measure";

import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "../../../../types/shared.ts";
import { Pill } from "../../Pill/Pill.tsx";
import { useChildren, useUniqueChild } from "../../Section/hooks.ts";
import styles from "../styles.module.css";

type PropertyCellProps = PropsWithChildren<{
  typeInfo?: DisplayTypeInfo;
  typeAnnotations?: PropertyAnnotations[];
  isOpen: boolean;
}>;

const TitleContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  function TitleContainer({ children }, ref) {
    return (
      <div ref={ref} className={styles.propertyTitleContainer}>
        {children}
      </div>
    );
  }
);

const TitlePrefixContainer = forwardRef<HTMLSpanElement, PropsWithChildren>(
  function TitlePrefixContainer({ children }, ref) {
    return (
      <span ref={ref} className={styles.propertyTitlePrefixContainer}>
        {children}
      </span>
    );
  }
);

function TypeContainer({
  multiline,
  contents,
}: {
  multiline: boolean;
  contents: string;
}) {
  return (
    <div>
      <div
        className={clsx(
          styles.typeInnerContainer,
          multiline
            ? styles.typeInnerContainerMultiline
            : styles.typeInnerContainerInline
        )}
        dangerouslySetInnerHTML={{ __html: contents }}
      />
    </div>
  );
}

const OffscreenMeasureContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  function OffscreenMeasureContainer({ children }, ref) {
    return (
      <div className={styles.offscreenMeasureContainer} ref={ref}>
        {children}
      </div>
    );
  }
);

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

export function PropertyCell({
  children,
  typeInfo,
  typeAnnotations,
  isOpen,
}: PropertyCellProps) {
  // We measure the title container (which includes available space for the
  // inline type), the title prefix (which is only the property name and
  // annotations), and the type container so that we can determine if and how to
  // split the type display into multiple lines. We alias the bounds so the
  // useMemo isn't affected by non-width bounds changing (or reference
  // instability)
  const [titleContainerRef, titleContainerBounds] = useMeasure();
  const titleContainerWidth = titleContainerBounds.width;
  const [titlePrefixContainerRef, titlePrefixContainerBounds] = useMeasure();
  const titlePrefixContainerWidth = titlePrefixContainerBounds.width;
  const [
    offscreenTextSizeMeasureContainerRef,
    offscreenTextSizeMeasureContainerBounds,
  ] = useMeasure();
  const [
    offscreenTypeMeasureContainerRef,
    offscreenTypeMeasureContainerBounds,
  ] = useMeasure();
  const offscreenTextSizeMeasureContainerWidth =
    offscreenTextSizeMeasureContainerBounds.width;
  const offscreenTypeMeasureContainerWidth =
    offscreenTypeMeasureContainerBounds.width;

  // In this case, the title child is only the property name, but not the type
  // or annotations. We'll dynamically append the annotations here. We'll also
  // dynamically append the type, or a placeholder, depending on screen size
  const titleChild = useUniqueChild(children, "title");

  // In cases where we append a placeholder to the title, we'll add the full
  // type as a prefix to the content children
  const contentChildren = useChildren(children, "content");

  const displayInfo = useMemo(() => {
    if (!typeInfo) {
      return;
    }

    const { display: singleLineDisplay, measure: singleLineMeasure } =
      computeSingleLineDisplayType(typeInfo);
    // If the value is 0, that means we haven't rendered yet and don't know the
    // width. In this case, we just don't render the type at all.
    if (offscreenTextSizeMeasureContainerWidth === 0) {
      return {
        multiline: false,
        contents: "",
      };
    }

    // Determine if we need to show this in two lines, based on the width of the
    // the measured single line type
    const multiline =
      offscreenTypeMeasureContainerWidth >
      titleContainerWidth - titlePrefixContainerWidth;

    // If the measured width is 0, that means we're running on the server in which
    // case we want to render content on a single line. We only need maxCharacters
    // in the multiline case, so we don't need to consider the title width when
    // computing max characters.
    const maxMultilineCharacters =
      titleContainerWidth === 0 || offscreenTextSizeMeasureContainerWidth === 0
        ? Infinity
        : // We subtract 4 here to account for the padding on the left and right
          Math.floor(
            titleContainerWidth / offscreenTextSizeMeasureContainerWidth
          ) - 4;

    // Finally, if we are multiline, compute the multiline type label, otherwise
    // we can reuse the single line version we already computed
    const contents = multiline
      ? computeMultilineTypeLabel(typeInfo, 0, maxMultilineCharacters).contents
      : singleLineDisplay;

    return {
      multiline,
      contents,
      singleLineDisplay,
      singleLineMeasure,
    };
  }, [
    offscreenTextSizeMeasureContainerWidth,
    offscreenTypeMeasureContainerWidth,
    titleContainerWidth,
    titlePrefixContainerWidth,
    typeInfo,
  ]);

  if (!displayInfo || !typeInfo) {
    return (
      <div className={styles.propertyCell}>
        <TitleContainer ref={titleContainerRef}>
          <TitlePrefixContainer ref={titlePrefixContainerRef}>
            {titleChild}
            {typeAnnotations?.map((annotation) => (
              <Pill key={annotation.title} variant={annotation.variant}>
                {annotation.title}
              </Pill>
            ))}
          </TitlePrefixContainer>
        </TitleContainer>

        {isOpen && (
          <div className={styles.propertyCellContent}>{contentChildren}</div>
        )}
      </div>
    );
  }

  const { multiline, contents, singleLineMeasure } = displayInfo;

  return (
    <div className={styles.propertyCell}>
      <TitleContainer ref={titleContainerRef}>
        <TitlePrefixContainer ref={titlePrefixContainerRef}>
          {titleChild}
          {typeAnnotations?.map((annotation) => (
            <Pill key={annotation.title} variant={annotation.variant}>
              {annotation.title}
            </Pill>
          ))}
        </TitlePrefixContainer>
        {multiline ? (
          <div>
            <div
              className={clsx(
                styles.typeInnerContainer,
                styles.typeInnerContainerInline
              )}
            >
              {typeInfo.label}
            </div>
          </div>
        ) : (
          <TypeContainer multiline={multiline} contents={contents} />
        )}
      </TitleContainer>

      {isOpen && (multiline || contentChildren.length > 0) && (
        <div className={styles.propertyCellContent}>
          {multiline && (
            <TypeContainer multiline={multiline} contents={contents} />
          )}
          {contentChildren}
        </div>
      )}

      {/* This offscreen measure is used to determine the width of a character,
          for use in multiline type computation */}
      <OffscreenMeasureContainer ref={offscreenTextSizeMeasureContainerRef}>
        A
      </OffscreenMeasureContainer>

      {/* This offscreen measure is used to determine the width of the single
          line type, for use in determining if we need to split the type into
          multiple lines */}
      <OffscreenMeasureContainer ref={offscreenTypeMeasureContainerRef}>
        {singleLineMeasure}
      </OffscreenMeasureContainer>
    </div>
  );
}
