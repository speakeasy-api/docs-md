import { LitElement } from "lit";
import { state } from "lit/decorators.js";

export class SpeakeasyComponent extends LitElement {
  @state()
  private slotContent = new Map<string, boolean>();

  protected override firstUpdated(): void {
    // Query all slots and check if they have content
    const slots = this.shadowRoot?.querySelectorAll("slot");
    slots?.forEach((slot) => {
      const slotName = slot.name || "default";
      const hasContent = slot.assignedNodes().length > 0;
      this.slotContent.set(slotName, hasContent);
    });
    // Trigger re-render with the slot information
    this.requestUpdate();
  }

  protected hasSlot = (slotName: string) =>
    this.slotContent.get(slotName) ?? false;
}
