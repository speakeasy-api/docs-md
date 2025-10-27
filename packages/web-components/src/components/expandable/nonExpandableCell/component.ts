"use client";

import { html } from "lit";
import { customElement } from "lit/decorators.js";

import type { LitProps } from "../../../types/components.ts";
import { SpeakeasyComponent } from "../../../util/SpeakeasyComponent.ts";
import { styles as litStyles } from "./styles.ts";

export type NonExpandableCellProps = LitProps<NonExpandableCell>;

/**
 * A non expandable cell is part of a schema row. It is responsible for
 * rendering the non-expandable button used in the tree-view of the schema. A
 * row is considered non-expandable if it a) has no child breakouts or
 * properties _and_ b) has no front matter. NonExpandableCell takes no props.
 *
 * Each row always has either one ExpandableCell or one NonExpandableCell, and
 * are always to the right of the connecting cells.
 */
@customElement("spk-non-expandable-cell")
export class NonExpandableCell extends SpeakeasyComponent {
  static override styles = litStyles;

  public override render() {
    return html`<span class="nonExpandableCell"></span>`;
  }
}
