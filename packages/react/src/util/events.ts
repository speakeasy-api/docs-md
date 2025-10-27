"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

type Listener = {
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
};

export function useEventListeners(listeners: Partial<Listener>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (element) {
      for (const eventName of Object.keys(
        listeners
      ) as (keyof HTMLElementEventMap)[]) {
        const handler = listeners[eventName];
        if (handler) {
          element.addEventListener(eventName, handler as EventListener);
        }
      }
    }
  }, [listeners]);

  // Unfortunately HTMLElement isn't generic, and so we get type mismatch errors
  // when trying to assign this ref to one of our web components. Since we only
  // use this ref to add event listeneres, which all HTMLElements support, we
  // cast to `any` to keep usage of this hook simple
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ref as RefObject<any>;
}
