import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

const styles = css`
  .pill {
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

@customElement("speakeasy-pill")
export class Pill extends LitElement {
  static override styles = styles;

  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  // Declare reactive properties
  @property()
  variant = "primary";

  // Render the UI as a function of component state
  public override render() {
    return html`<span
      class=${classMap({
        pill: true,
        [this.variant]: true,
      })}
    >
      <slot />
    </span>`;
  }
}
