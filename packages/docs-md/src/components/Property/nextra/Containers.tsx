import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { forwardRef } from "react";

import styles from "./styles.module.css";

export const OuterContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ multiline: boolean }>
>(function OuterContainer({ children, multiline }, ref) {
  return (
    <div
      ref={ref}
      className={clsx(
        styles.container,
        multiline ? styles.containerMutliline : styles.containerSingleLine
      )}
    >
      {children}
    </div>
  );
});

export const TitleContainer = forwardRef<HTMLSpanElement, PropsWithChildren>(
  function TitleContainer({ children }, ref) {
    return (
      <span ref={ref} className={styles.titleContainer}>
        {children}
      </span>
    );
  }
);

export const TypeContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ multiline: boolean; contents: string }>
>(function TypeContainer({ multiline, contents }, ref) {
  return (
    <div ref={ref}>
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
});

export const OffscreenMeasureContainer = forwardRef<HTMLDivElement>(
  function OffscreenMeasureContainer(_, ref) {
    return (
      <div className={styles.offscreenMeasureContainer} ref={ref}>
        A
      </div>
    );
  }
);
