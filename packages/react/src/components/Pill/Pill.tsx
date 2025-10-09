import type { PillVariant } from "@speakeasy-api/docs-md-shared";
import clsx from "clsx";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./styles.module.css";
import type { PillProps } from "./types.ts";

/**
 * A pill displays a small piece of information inline surrounded by a border
 * and optional background color. The pill takes in a "variant" that controls
 * the color scheme, such as "primary" or "error".
 */
export function Pill({ variant, children }: PillProps) {
  return <span className={clsx(styles.pill, styles[variant])}>{children}</span>;
}

@customElement("spk-pill")
class PillElement extends LitElement {
  static override styles = css`
    .pill {
      display: inline-block;
      border-radius: var(--speakeasy-pill-border-radius);
      padding: var(--speakeasy-pill-padding);
      font-family: var(--speakeasy-pill-font-family);
      font-size: var(--speakeasy-pill-font-size);
    }

    .warning {
      background-color: var(--speakeasy-pill-warning-background-color);
      color: var(--speakeasy-pill-warning-color);
      border: var(--speakeasy-border-width) solid
        var(--speakeasy-pill-warning-border-color);
    }

    .error {
      background-color: var(--speakeasy-pill-error-background-color);
      color: var(--speakeasy-pill-error-color);
      border: var(--speakeasy-border-width) solid
        var(--speakeasy-pill-error-border-color);
    }

    .info {
      background-color: var(--speakeasy-pill-info-background-color);
      color: var(--speakeasy-pill-info-color);
      border: var(--speakeasy-border-width) solid
        var(--speakeasy-pill-info-border-color);
    }

    .success {
      background-color: var(--speakeasy-pill-success-background-color);
      color: var(--speakeasy-pill-success-color);
      border: var(--speakeasy-border-width) solid
        var(--speakeasy-pill-success-border-color);
    }

    .primary {
      background-color: var(--speakeasy-pill-primary-background-color);
      color: var(--speakeasy-pill-primary-color);
      border: var(--speakeasy-border-width) solid
        var(--speakeasy-pill-primary-border-color);
    }

    .secondary {
      background-color: var(--speakeasy-pill-secondary-background-color);
      color: var(--speakeasy-pill-secondary-color);
      border: var(--speakeasy-border-width) solid
        var(--speakeasy-pill-secondary-border-color);
    }
  `;

  @property({ type: String })
  public variant: PillVariant = "primary";

  public override render() {
    return html`<span class="pill ${this.variant}">
      <slot name="content"></slot>
    </span>`;
  }
}
