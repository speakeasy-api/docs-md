import clsx from "clsx";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { InternalError } from "../../../util/internalError.ts";
import { ExtendedLitElement } from "../util.ts";

@customElement("speakeasy-tabbed-section-button")
export class TabButton extends LitElement {
  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  // Declare reactive properties
  @property()
  isActive = false;

  @property()
  onClick: () => void;

  // Render the UI as a function of component state
  public override render() {
    return html` <button
      onClick=${this.onClick}
      className=${clsx(
        "speakeasy-tabbed-section--button",
        this.isActive
          ? "speakeasy-tabbed-section--buttonActive"
          : "speakeasy-tabbed-section--buttonInactive"
      )}
      style=${{
        fontWeight: this.isActive ? "bold" : "normal",
      }}
    >
      ${this.children}
    </button>`;
  }
}

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
    console.log("activeChild", this.#activeTabId, activeChild);

    const tabChildrenWithButtons = tabChildren.map((tabChild) => {
      const id = tabChild.attributes.getNamedItem("id")?.value;
      if (!id) {
        throw new InternalError("Could not get id from tab");
      }
      return html`<speakeasy-tabbed-section-button
        key=${id}
        isActive=${id === this.#activeTabId}
        @click=${() => this.#setActiveTabId(id)}
      >
        ${tabChild}
      </speakeasy-tabbed-section-button>`;
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

/*
<div
      class=${clsx(this.variant !== "breakout" && "speakeasy-section--section")}
    >
      <div>${titleChild}</div>
      <div
        class=${clsx(
          this.variant === "breakout" && "speakeasy-section--breakout",
          this.variant === "top-level" && "speakeasy-section--topLevel"
        )}
      >
        ${contentChildren}
      </div>
    </div>
*/
