import type { CSSResultGroup } from "lit";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

const styles = css`
  .content h2,
  .content h3,
  .content h4,
  .content h5,
  .content h6 {
    /* Normalize padding on headings across scaffolds */
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .content > :last-child {
    margin-bottom: 0;
  }

  .breakout {
    padding-left: 3rem;
  }
`;

@customElement("speakeasy-section-content")
export class SectionContent extends LitElement {
  // TODO: figure out a better way to type this
  static override styles = styles as unknown as CSSResultGroup;

  // Declare reactive properties
  @property()
  variant = "primary";

  @property()
  override id = "";

  @property()
  override slot = "";

  // Render the UI as a function of component state
  public override render() {
    return html`<div
      class=${classMap({
        content: true,
        breakout: this.variant === "breakout",
        topLevel: this.variant === "top-level",
      })}
      id="${this.id}"
      slot="${this.slot}"
    >
      <slot />
    </div>`;
  }
}
