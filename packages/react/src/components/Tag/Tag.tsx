import type { TagDescriptionProps, TagProps, TagTitleProps } from "./types";

export function Tag({ children, slot }: TagProps) {
  return <div slot={slot}>{children}</div>;
}

export function TagTitle({ children, slot }: TagTitleProps) {
  return <div slot={slot}>{children}</div>;
}

export function TagDescription({ children, slot }: TagDescriptionProps) {
  return <div slot={slot}>{children}</div>;
}
