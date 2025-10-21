"use client";

import clsx from "clsx";
import type { JSX, PropsWithChildren } from "react";
import { forwardRef, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";

import {
  computeMultilineTypeLabel,
  computeSingleLineDisplayType,
} from "../../../util/displayType.ts";
import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ConnectingCell as DefaultConnectingCell } from "../../ConnectingCell/ConnectingCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ExpandableCell as DefaultExpandableCell } from "../../ExpandableCell/ExpandableCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { NonExpandableCell as DefaultNonExpandableCell } from "../../NonExpandableCell/NonExpandableCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { Pill as DefaultPill } from "../../Pill/Pill.tsx";
import { useHashManager } from "../hashManager.ts";
import styles from "../styles.module.css";
import type { ExpandablePropertyProps } from "../types.ts";

// When enabled, a debug overlay will be shown when the property title is hovered
const ENABLE_DEBUG_VIEW = false;

const TitleContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    onMouseEnter?: () => void;
  }>
>(function TitleContainer({ children, onMouseEnter }, ref) {
  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      className={styles.propertyTitleContainer}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  );
});

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

export function PropertyContents({
  headingId,
  slot,
  children,
  typeInfo,
  typeAnnotations,
  hasExpandableContent,
  expandByDefault,
  ExpandableCell = DefaultExpandableCell,
  NonExpandableCell = DefaultNonExpandableCell,
  Pill = DefaultPill,
  ConnectingCell = DefaultConnectingCell,
}: ExpandablePropertyProps) {
  const [isOpen, setIsOpen] = useState(expandByDefault);
  // Ref for the debug overlay element
  const debugOverlayRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = ENABLE_DEBUG_VIEW
    ? () => {
        // Hide all other debug overlays
        // This is handled via document queries to avoid doing any additional
        // state management since this is only enabled when debug is enabled
        document
          .querySelectorAll('[data-debug-visible="true"]')
          .forEach((el) => el.setAttribute("data-debug-visible", "false"));

        // Show this component's debug overlay
        if (debugOverlayRef.current) {
          debugOverlayRef.current.setAttribute("data-debug-visible", "true");
        }
      }
    : undefined;

  useHashManager(headingId, setIsOpen);

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
  const descriptionChildren = useChildren(children, "description");
  const examplesChildren = useChildren(children, "examples");
  const defaultValueChildren = useChildren(children, "defaultValue");
  const embedChildren = useChildren(children, "embed");
  const breakoutsChildren = useChildren(children, "breakouts");

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

  const titlePrefix = (
    <TitlePrefixContainer ref={titlePrefixContainerRef}>
      {titleChild}
      {typeAnnotations?.map((annotation) => (
        <Pill key={annotation.title} variant={annotation.variant}>
          {annotation.title}
        </Pill>
      ))}
    </TitlePrefixContainer>
  );

  const debugOverlay = (
    <div
      ref={debugOverlayRef}
      className={styles.debugOverlay}
      data-debug-visible="false"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "#00ff00",
        padding: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        borderRadius: "4px",
        marginTop: "4px",
        whiteSpace: "pre",
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
      }}
    >
      {`Title Container: ${titleContainerBounds.width}x${titleContainerBounds.height}
Title Prefix: ${titlePrefixContainerBounds.width}x${titlePrefixContainerBounds.height}
Type Measure: ${offscreenTypeMeasureContainerBounds.width}x${offscreenTypeMeasureContainerBounds.height}
Text Size: ${offscreenTextSizeMeasureContainerBounds.width}x${offscreenTextSizeMeasureContainerBounds.height}
Multiline: ${displayInfo?.multiline ?? "N/A"}`}
    </div>
  );

  const hasChildrenConnection =
    breakoutsChildren.length > 0 ? "connected" : "none";
  const frontmatter = (
    <>
      <ConnectingCell
        bottom={hasChildrenConnection}
        top={hasChildrenConnection}
        right="none"
      >
        {descriptionChildren}
      </ConnectingCell>
      <ConnectingCell
        bottom={hasChildrenConnection}
        top={hasChildrenConnection}
        right="none"
      >
        {examplesChildren}
      </ConnectingCell>
      <ConnectingCell
        bottom={hasChildrenConnection}
        top={hasChildrenConnection}
        right="none"
      >
        {defaultValueChildren}
      </ConnectingCell>
      <ConnectingCell
        bottom={hasChildrenConnection}
        top={hasChildrenConnection}
        right="connected"
      >
        {embedChildren}
      </ConnectingCell>
      {breakoutsChildren}
    </>
  );

  let titleContainer: JSX.Element;
  let propertyCell: JSX.Element;
  let measureContainer: JSX.Element | null = null;
  if (!displayInfo || !typeInfo) {
    titleContainer = (
      <TitleContainer ref={titleContainerRef} onMouseEnter={handleMouseEnter}>
        {titlePrefix}
        {ENABLE_DEBUG_VIEW && debugOverlay}
      </TitleContainer>
    );
    propertyCell = frontmatter;
  } else {
    titleContainer = (
      <TitleContainer ref={titleContainerRef} onMouseEnter={handleMouseEnter}>
        {titlePrefix}
        {displayInfo.multiline ? (
          <div
            className={clsx(
              styles.typeInnerContainer,
              styles.typeInnerContainerInline
            )}
          >
            {typeInfo.label}
          </div>
        ) : (
          <TypeContainer
            multiline={displayInfo.multiline}
            contents={displayInfo.contents}
          />
        )}
        {ENABLE_DEBUG_VIEW && debugOverlay}
      </TitleContainer>
    );
    propertyCell = (
      <>
        {displayInfo.multiline && (
          <ConnectingCell
            bottom={hasChildrenConnection}
            top={hasChildrenConnection}
            right="none"
          >
            <TypeContainer
              multiline={displayInfo.multiline}
              contents={displayInfo.contents}
            />
          </ConnectingCell>
        )}
        {frontmatter}
      </>
    );
    measureContainer = (
      <>
        {/* This offscreen measure is used to determine the width of a character,
          for use in multiline type computation */}
        <OffscreenMeasureContainer ref={offscreenTextSizeMeasureContainerRef}>
          A
        </OffscreenMeasureContainer>

        {/* This offscreen measure is used to determine the width of the single
          line type, for use in determining if we need to split the type into
          multiple lines */}
        <OffscreenMeasureContainer ref={offscreenTypeMeasureContainerRef}>
          {displayInfo.singleLineMeasure}
        </OffscreenMeasureContainer>
      </>
    );
  }

  return (
    <div slot={slot} data-testid={headingId} className={styles.entryContainer}>
      <div className={styles.entryHeaderContainer}>
        {hasExpandableContent ? (
          <ExpandableCell
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            variant="property"
          />
        ) : (
          <NonExpandableCell />
        )}
        {titleContainer}
      </div>
      {isOpen && propertyCell}
      {measureContainer}
    </div>
  );
}
