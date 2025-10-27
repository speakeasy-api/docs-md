import type { LitElement } from "lit";

type EventOptions = {
  /**
   * The event type/name
   */
  type: keyof HTMLElementEventMap;
  /**
   * Whether the event bubbles up through the DOM
   * @default false
   */
  bubbles?: boolean;
  /**
   * Whether the event can cross shadow DOM boundaries
   * @default true
   */
  composed?: boolean;
  /**
   * Whether the event can be cancelled
   * @default false
   */
  cancelable?: boolean;
};

export type EventDispatcher<Detail = never> = (detail: Detail) => boolean;

/**
 * Creates a type-safe event handler with automatic event type inference. This
 * handler doesn't actually do anything at runtime, and is just for ergonomics.
 */
export function eventHandler<K extends keyof HTMLElementEventMap>(
  _eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void
) {
  return handler;
}

/**
 * Decorator that creates a declarative event dispatcher on a Lit element.
 *
 * Usage:
 * ```typescript
 * class MyElement extends LitElement {
 *   @event({ type: 'my-event' })
 *   private dispatchMyEvent!: (detail: { value: string }) => void;
 *
 *   handleClick() {
 *     this.dispatchMyEvent({ value: 'hello' });
 *   }
 * }
 * ```
 *
 * @param options - Event configuration options
 */
export function event<Detail = unknown>(
  options: EventOptions
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    // Define the property getter that returns a dispatcher function
    Object.defineProperty(target, propertyKey, {
      get(this: LitElement): (detail: Detail) => boolean {
        return (detail: Detail) => {
          const customEvent = new CustomEvent<Detail>(options.type, {
            bubbles: options.bubbles ?? false,
            composed: options.composed ?? true,
            cancelable: options.cancelable ?? false,
            detail,
          });
          return this.dispatchEvent(customEvent);
        };
      },
      enumerable: true,
      configurable: true,
    });
  };
}
