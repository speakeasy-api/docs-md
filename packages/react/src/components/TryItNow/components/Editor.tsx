"use client";

import type { EditorProps } from "../types";

export function Editor({ defaultValue, onValueChange }: EditorProps) {
  console.log(onValueChange);
  return (
    <pre>
      <code>{defaultValue}</code>
    </pre>
  );
}
