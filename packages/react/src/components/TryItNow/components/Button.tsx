"use client";

import clsx from "clsx";
import { useState } from "react";

// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { CheckIcon as DefaultCheckIcon } from "../../CheckIcon/CheckIcon.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { CopyIcon as DefaultCopyIcon } from "../../CopyIcon/CopyIcon.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ResetIcon as DefaultResetIcon } from "../../ResetIcon/ResetIcon.tsx";
import type {
  ButtonProps,
  CopyButtonProps,
  ResetButtonProps,
} from "../types.ts";
import styles from "./styles.module.css";

function Button({ onClick, ariaLabel, children, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
      className={clsx(styles.button, className)}
    >
      {children}
    </button>
  );
}

export function DefaultRunButton({ onClick }: Pick<ButtonProps, "onClick">) {
  return (
    <Button onClick={onClick} ariaLabel="Run code">
      Run
    </Button>
  );
}

export function DefaultResetButton({
  onClick,
  ResetIcon = DefaultResetIcon,
}: ResetButtonProps) {
  return (
    <Button
      className={styles.iconButton}
      onClick={onClick}
      ariaLabel="Reset code"
    >
      <ResetIcon />
    </Button>
  );
}

export function DefaultCopyButton({
  copyValue,
  CheckIcon = DefaultCheckIcon,
  CopyIcon = DefaultCopyIcon,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    if (copyValue) {
      void navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button
      className={styles.iconButton}
      onClick={handleClick}
      ariaLabel={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
