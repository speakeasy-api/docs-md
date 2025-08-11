import clsx from "clsx";
import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { InternalError } from "../../../util/internalError.ts";
import { ExtendedLitElement } from "../util.ts";

@customElement("speakeasy-tabbed-section")
export class TabbedSection extends ExtendedLitElement {
  #activeTabId: string | null = null;

  // Render the UI as a function of component state
  public override render() {
    super.render();

    const titleChild = this.getUniqueChild("tab-title");
    const tabChildren = this.getChildren("tab");
    const contentChildren = this.getChildren("tab-content");

    if (!this.#activeTabId) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#activeTabId = tabChildren[0]!.attributes.getNamedItem("id")!.value;
    }
    const activeChild = contentChildren.find(
      (child) => child.id === this.#activeTabId
    );

    const tabChildrenWithButtons = tabChildren.map((tabChild) => {
      const id = tabChild.attributes.getNamedItem("id")?.value;
      if (!id) {
        throw new InternalError("Could not get id from tab");
      }
      const isActive = id === this.#activeTabId;
      return html` <button
        @click=${() => this.#setActiveTabId(id)}
        class=${clsx(
          "speakeasy-tabbed-section--button",
          isActive
            ? "speakeasy-tabbed-section--buttonActive"
            : "speakeasy-tabbed-section--buttonInactive"
        )}
        style=${{
          fontWeight: isActive ? "bold" : "normal",
        }}
      >
        ${tabChild}
      </button>`;
    });

    return html`<div class=${clsx("speakeasy-section--section")}>
      <div class=${clsx("speakeasy-tabbed-section--titleContainer")}>
        <div>${titleChild}</div>
        <div class=${clsx("speakeasy-tabbed-section--tabs")}>
          ${tabChildrenWithButtons}
        </div>
      </div>
      <div class=${clsx("speakeasy-section--topLevel")}>${activeChild}</div>
    </div>`;
  }

  #setActiveTabId(id: string) {
    console.log("setActiveTabId", id);
    this.#activeTabId = id;
    this.requestUpdate();
  }
}
