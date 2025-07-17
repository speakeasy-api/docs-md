import clsx from "clsx";
import { useMemo } from "react";
import useMeasure from "react-use-measure";

import type { TypeInfo } from "../../../renderers/base/base.ts";
import type { PropertyProps } from "../common/types.ts";
import styles from "./styles.module.css";

// TODO: measure this dynamically
const DEFAULT_CHARACTER_WIDTH = 7.7;

function computeSingleLineDisplayType(typeInfo: TypeInfo): {
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
  typeInfo: TypeInfo,
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

export function DocusaurusProperty({ children, typeInfo }: PropertyProps) {
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

  const { multiline, contents } = useMemo(() => {
    // Compute the width take by the type on a single line, and whether or not
    // we need to split the type into a separate line from the title
    const { display, measure } = computeSingleLineDisplayType(typeInfo);
    const singleLineWidth =
      measure.length * DEFAULT_CHARACTER_WIDTH + titleContainerWidth;
    const multiline = singleLineWidth > outerContainerWidth;

    // If the measured width is 0, that means we're running on the server in which
    // case we want to render content on a single line. We only need maxCharacters
    // in the multiline case, so we don't need to consider the title width when
    // computing max characters.
    const maxCharacters =
      Math.floor(typeContainerWidth / DEFAULT_CHARACTER_WIDTH) || Infinity;

    // Finally, if we are multiline, compute the multiline type label, otherwise
    // we can reuse the single line version we already computed
    const contents = multiline
      ? computeMultilineTypeLabel(typeInfo, 0, maxCharacters).contents
      : display;

    return {
      multiline,
      contents,
    };
  }, [typeInfo, titleContainerWidth, typeContainerWidth, outerContainerWidth]);

  return (
    <div
      ref={outerContainerRef}
      className={clsx(
        styles.container,
        multiline ? styles.containerMutliline : styles.containerSingleLine
      )}
    >
      <span ref={titleContainerRef} className={styles.titleContainer}>
        {children}
      </span>
      <div ref={typeContainerRef} className={styles.typeOuterContainer}>
        <div
          className={clsx(
            styles.typeInnerContainer,
            !multiline && styles.typeInnerContainerInline
          )}
          dangerouslySetInnerHTML={{ __html: contents }}
        />
      </div>
    </div>
  );
}
