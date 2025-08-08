import type { CSSResultGroup } from "lit";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

const styles = css`
  /* Reset margins, which vary between scaffolds */
  .section h1:first-child,
  .section h2:first-child,
  .section h3:first-child,
  .section h4:first-child,
  .section h5:first-child,
  .section h6:first-child {
    margin: 0;
  }

  .breakout {
    border-left: var(--speakeasy-border-width) solid
      var(--speakeasy-expandable-line-color);
    margin-left: 0.5rem;
  }

  .topLevel {
    padding-bottom: 2rem;
  }
`;

@customElement("speakeasy-section")
export class Section extends LitElement {
  // TODO: figure out a better way to type this
  static override styles = styles as unknown as CSSResultGroup;

  // Declare reactive properties
  @property()
  variant = "primary";

  // Render the UI as a function of component state
  public override render() {
    return html`<div
      class=${classMap({ section: this.variant !== "breakout" })}
    >
      <div><slot name="title" /></div>
      <div
        class=${classMap({
          breakout: this.variant === "breakout",
          topLevel: this.variant === "top-level",
        })}
      >
        <slot name="content" />
      </div>
    </div>`;
  }
}
