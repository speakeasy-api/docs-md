import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { forwardRef, useMemo } from "react";
import useMeasure from "react-use-measure";

import type { DisplayTypeInfo } from "../../../types/shared.ts";
import { computeMultilineTypeLabel } from "../../util/displayType.ts";
import expandableSectionStyles from "../ExpandableSection/styles.module.css";
import styles from "./styles.module.css";

type FrontMatterDisplayTypeProps = {
  typeInfo: DisplayTypeInfo;
};

const TitleContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  function TitleContainer({ children }, ref) {
    return (
      <div ref={ref} className={expandableSectionStyles.propertyTitleContainer}>
        {children}
      </div>
    );
  }
);

const OffscreenMeasureContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  function OffscreenMeasureContainer({ children }, ref) {
    return (
      <div
        className={expandableSectionStyles.offscreenMeasureContainer}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export function FrontMatterDisplayType({
  typeInfo,
}: FrontMatterDisplayTypeProps) {
  // We measure the title container (which includes available space for the
  // inline type), the title prefix (which is only the property name and
  // annotations), and the type container so that we can determine if and how to
  // split the type display into multiple lines. We alias the bounds so the
  // useMemo isn't affected by non-width bounds changing (or reference
  // instability)
  const [typeContainerRef, typeContainerBounds] = useMeasure();
  const typeContainerWidth = typeContainerBounds.width;
  const [offscreenMeasureContainerRef, offscreenMeasureContainerBounds] =
    useMeasure();
  const offscreenMeasureContainerWidth = offscreenMeasureContainerBounds.width;

  const contents = useMemo(() => {
    // If the value is 0, that means we haven't rendered yet and don't know the
    // width. In this case, we just don't render the type at all.
    if (offscreenMeasureContainerWidth === 0) {
      return "";
    }

    // If the measured width is 0, that means we're running on the server in which
    // case we want to render content on a single line. We only need maxCharacters
    // in the multiline case, so we don't need to consider the title width when
    // computing max characters.
    const maxMultilineCharacters =
      typeContainerWidth === 0
        ? Infinity
        : // We subtract 4 here to account for the padding on the left and right
          Math.floor(typeContainerWidth / offscreenMeasureContainerWidth) - 4;

    // Finally, if we are multiline, compute the multiline type label, otherwise
    // we can reuse the single line version we already computed
    return computeMultilineTypeLabel(typeInfo, 0, maxMultilineCharacters)
      .contents;
  }, [offscreenMeasureContainerWidth, typeContainerWidth, typeInfo]);

  return (
    <div className={styles.frontMatterDisplayTypeContainer}>
      <TitleContainer ref={typeContainerRef}>
        <div
          className={clsx(
            expandableSectionStyles.typeInnerContainer,
            expandableSectionStyles.typeInnerContainerMultiline
          )}
          dangerouslySetInnerHTML={{ __html: contents }}
        />
      </TitleContainer>

      {/* This offscreen measure is used to determine the width of a character,
          for use in multiline type computation */}
      <OffscreenMeasureContainer ref={offscreenMeasureContainerRef}>
        A
      </OffscreenMeasureContainer>
    </div>
  );
}
