import type { PropsWithChildren } from "react";

export type TagProps = PropsWithChildren<{
  /**
   * The slot for the tag, always "tag"
   */
  slot: "tag";
}>;
export type TagTitleProps = PropsWithChildren<{
  /**
   * The slot for the tag title, always "title"
   */
  slot: "title";
}>;
export type TagDescriptionProps = PropsWithChildren<{
  /**
   * The slot for the tag description, always "description"
   */
  slot: "description";
}>;
