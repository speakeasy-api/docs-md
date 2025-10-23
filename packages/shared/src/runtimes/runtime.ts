export abstract class Runtime<RuntimeEvent extends { type: string }> {
  #listeners: Record<RuntimeEvent["type"], ((event: RuntimeEvent) => void)[]>;

  constructor(
    listeners: Record<RuntimeEvent["type"], ((event: RuntimeEvent) => void)[]>
  ) {
    this.#listeners = listeners;
  }

  public on(
    event: RuntimeEvent["type"],
    callback: (event: RuntimeEvent) => void
  ) {
    this.#listeners[event].push(callback);
  }

  protected emit(event: RuntimeEvent) {
    const callbacks = this.#listeners[event.type as RuntimeEvent["type"]];
    for (const callback of callbacks) {
      callback(event);
    }
  }

  public abstract run(code: string): void;
  public abstract cancel(): void;
}
