import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

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

@customElement("speakeasy-tabbed-section")
export class TabbedSection extends LitElement {
  static override styles = styles;

  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  // Declare reactive properties
  @property()
  variant = "primary";

  @property()
  override id = "";

  @property()
  override slot = "";

  // Render the UI as a function of component state
  public override render() {
    console.log(this.children);
    let titleChild;
    const tabChildren: Element[] = [];
    const contentChildren: Element[] = [];
    for (const child of this.children) {
      if (child.slot === "tab-title") {
        titleChild = child;
      } else if (child.slot === "tab") {
        tabChildren.push(child);
      } else if (child.slot === "tab-content") {
        contentChildren.push(child);
      }
    }
    console.log("title", titleChild);
    console.log("tabs", tabChildren);
    console.log("content", contentChildren);
    return html`<speakeasy-section variant="top-level">
      <speakeasy-section-title slot="title" variant="top-level">
        <div className="{styles.titleContainer}">
          ${titleChild}
          <slot name="tab" />
          <slot name="tab" />
        </div>
      </speakeasy-section-title>
      <speakeasy-section-content slot="content" variant="top-level">
        <slot name="tab-content" />
      </speakeasy-section-content>
    </speakeasy-section>`;
  }
}
