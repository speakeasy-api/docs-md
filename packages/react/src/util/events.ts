"use client";

import { useEffect, useRef } from "react";

type Listener = {
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
};

export function useEventListeners<T extends HTMLElement>(
  listeners: Partial<Listener>
) {
  const ref = useRef<T>(null);
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
  return ref;
}
