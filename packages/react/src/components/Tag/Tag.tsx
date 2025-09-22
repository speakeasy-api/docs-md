import { useUniqueChild } from "../../util/hooks.ts";
import type { TagDescriptionProps, TagProps, TagTitleProps } from "./types";

/**
 * This component is a container for a tag. It contains the following sections,
 * if supplied:
 *
 * - Title: assigned to the `title` slot
 * - Description: assigned to the `description` slot
 *
 * Note: At least for the time being, operations are _not_ nested under Tag.
 */
export function Tag({ children, slot }: TagProps) {
  const titleChild = useUniqueChild(children, "title");
  const descriptionChild = useUniqueChild(children, "description");
  return (
    <div slot={slot}>
      {titleChild}
      {descriptionChild}
    </div>
  );
}

/**
 * This component is a container for a tag title. It is assigned to the `title`
 * slot of Tag.
 */
export function TagTitle({ children, slot }: TagTitleProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is a container for a tag description. It is assigned to the
 * `description` slot of Tag.
 */
export function TagDescription({ children, slot }: TagDescriptionProps) {
  return <div slot={slot}>{children}</div>;
}
