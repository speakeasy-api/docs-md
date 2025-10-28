"use client";

import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import type { LitProps } from "../../../../types/components.ts";
import { styles as litStyles } from "./styles.ts";

export type TreeTopperProps = LitProps<TreeTopper>;

/**
 * A component that renders a tree topper, which is a small dot that indicates
 * the start of a new tree. This component lives at the top of an expandable
 * section.
 */
@customElement("spk-internal-tree-topper")
export class TreeTopper extends LitElement {
  static override styles = litStyles;

  public override render() {
    return html`<div class="treeTopper">
      <div class="treeTopperDot"></div>
    </div>`;
  }
}
