import clsx from "clsx";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("speakeasy-tabbed-section")
export class TabbedSection extends LitElement {
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
        <div class=${clsx("speakeasy-tabbed-section--titleContainer")}>
          <div>${titleChild}</div>
          <div class=${clsx("speakeasy-tabbed-section--tabs")}>
            ${tabChildren}
          </div>
        </div>
      </speakeasy-section-title>
      <speakeasy-section-content slot="content" variant="top-level">
        ${contentChildren[0]}
      </speakeasy-section-content>
    </speakeasy-section>`;
  }
}
