import { html, LitElement } from "lit";

import { InternalError } from "../../util/internalError.ts";

export class ExtendedLitElement extends LitElement {
  #initialChildren: Element[] | null = null;

  // Disable lit's default shadow DOM
  override createRenderRoot() {
    return this;
  }

  public override render() {
    if (!this.#initialChildren) {
      this.#initialChildren = Array.from(this.children);
    }
    return html``;
  }

  protected getUniqueChild(slot: string) {
    if (!this.#initialChildren) {
      throw new InternalError("No initial children");
    }
    const matchedChildren = this.#initialChildren.filter(
      (child) => child.slot === slot
    );
    if (matchedChildren.length > 1) {
      throw new InternalError("Multiple children found for slot " + slot);
    }
    if (matchedChildren.length === 0) {
      throw new InternalError("No child found for slot " + slot);
    }
    return matchedChildren[0];
  }

  protected getChildren(slot: string) {
    if (!this.#initialChildren) {
      throw new InternalError("No initial children");
    }
    return this.#initialChildren.filter((child) => child.slot === slot);
  }
}
