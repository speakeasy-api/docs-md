import type { CSSResultGroup } from "lit";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

const styles = css`
  .title {
    /*
   * TODO: this is a magic number I found by trial and error. I don't know
   * why it's needed, but without it we don't scroll to the right place.
   * This may not be consistent across different Docusaurus instances
   */
    scroll-margin-top: 5rem;
  }

  .title h1,
  .title h2,
  .title h3,
  .title h4,
  .title h5,
  .title h6 {
    margin: 0;
    padding: 0;
  }

  .topLevel {
    padding-bottom: 1rem;
  }

  .breakout {
    display: flex;
    align-items: center;
    border-left: var(--speakeasy-border-width) solid
      var(--speakeasy-expandable-line-color);
    margin-left: 0.5rem;
  }

  .breakoutLine {
    min-width: 1rem;
    border-top: var(--speakeasy-border-width) solid
      var(--speakeasy-expandable-line-color);
  }
`;

@customElement("speakeasy-section-title")
export class SectionTitle extends LitElement {
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
      id=${this.id}
      class=${classMap({
        title: true,
        breakout: this.variant === "breakout",
        topLevel: this.variant === "top-level",
      })}
      slot=${this.slot}
    >
      ${this.variant === "breakout"
        ? html`<div class=${classMap({ breakoutLine: true })} />`
        : ""}
      <slot />
    </div>`;
  }
}
