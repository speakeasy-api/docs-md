import { useRef, useEffect, useState, useCallback, cloneElement } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { ActionImpl } from "kbar";
import { useKBar, KBAR_LISTBOX, getListboxItemId } from "kbar";

import type { ReactElement } from "react";

const START_INDEX = -1;

interface RenderParams<T = ActionImpl | string> {
  item: T;
  active: boolean;
}

// https://github.com/timc1/kbar/blob/main/packages/kbar/src/components/KBarResults.tsx
function usePointerMovedSinceMount() {
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    function handler() {
      setMoved(true);
    }

    if (!moved) {
      window.addEventListener("pointermove", handler);
      return () => window.removeEventListener("pointermove", handler);
    }

    return undefined;
  }, [moved]);

  return moved;
}

interface SuggestionsListProps {
  items: RenderParams["item"][];
  onRender: (params: RenderParams) => ReactElement;
  maxHeight?: number;
  setQuery: (submittedQuery: string) => void;
  setInputValue: (inputValue: string) => void;
}

export const SuggestionsList = ({
  onRender,
  items,
  maxHeight,
  setQuery,
  setInputValue,
}: SuggestionsListProps) => {
  const activeRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef(null);

  // store a ref to all items so we do not have to pass
  // them as a dependency when setting up event listeners.
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const rowVirtualizer = useVirtualizer({
    count: itemsRef.current.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
  });

  const { query, search, currentRootActionId, activeIndex, options } = useKBar(
    (state) => ({
      search: state.searchQuery,
      currentRootActionId: state.currentRootActionId,
      activeIndex: state.activeIndex,
    })
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.isComposing) {
        return;
      }

      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        event.stopPropagation();
        query.setActiveIndex((index) => {
          let nextIndex = index > START_INDEX ? index - 1 : index;
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === "string") {
            if (nextIndex === 0) return index;
            nextIndex -= 1;
          }
          return nextIndex;
        });
      } else if (
        event.key === "ArrowDown" ||
        (event.ctrlKey && event.key === "n")
      ) {
        event.preventDefault();
        event.stopPropagation();
        query.setActiveIndex((index) => {
          let nextIndex =
            index < itemsRef.current.length - 1 ? index + 1 : index;
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === "string") {
            if (nextIndex === itemsRef.current.length - 1) return index;
            nextIndex += 1;
          }
          return nextIndex;
        });
      } else if (event.key === "Enter") {
        // storing the active dom element in a ref prevents us from
        // having to calculate the current action to perform based
        // on the `activeIndex`, which we would have needed to add
        // as part of the dependencies array.
        activeRef.current?.click();
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () =>
      window.removeEventListener("keydown", handler, { capture: true });
  }, [query]);

  // destructuring here to prevent linter warning to pass
  // entire rowVirtualizer in the dependencies array.
  const { scrollToIndex } = rowVirtualizer;
  useEffect(() => {
    scrollToIndex(activeIndex, {
      // ensure that if the first item in the list is a group
      // name and we are focused on the second item, to not
      // scroll past that group, hiding it.
      align: activeIndex <= 1 ? "end" : "auto",
    });
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    // TODO(tim): fix scenario where async actions load in
    // and active index is reset to the first item. i.e. when
    // users register actions and bust the `useRegisterActions`
    // cache, we won't want to reset their active index as they
    // are navigating the list.
    query.setActiveIndex(
      // avoid setting active index on a group
      typeof items[START_INDEX] === "string" ? START_INDEX + 1 : START_INDEX
    );
  }, [search, currentRootActionId, items, query]);

  const execute = useCallback(
    (item: RenderParams["item"]) => {
      if (typeof item === "string") return;
      setInputValue(item.name);
      setQuery(item.name);
      query.setCurrentRootAction(item.id);
      options.callbacks?.onSelectAction?.(item);
    },
    [options.callbacks, setInputValue, setQuery, query]
  );

  const pointerMoved = usePointerMovedSinceMount();

  return (
    <div
      ref={parentRef}
      style={{
        maxHeight: maxHeight || 400,
        position: "relative",
        overflow: "auto",
      }}
      data-testid="code-words:suggestions-list"
    >
      <div
        role="listbox"
        id={KBAR_LISTBOX}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = itemsRef.current[virtualRow.index];
          if (!item) return null;
          const handlers = typeof item !== "string" && {
            onPointerMove: () =>
              pointerMoved &&
              activeIndex !== virtualRow.index &&
              query.setActiveIndex(virtualRow.index),
            onPointerDown: () => {
              query.setActiveIndex(virtualRow.index);
              execute(item);
            },
          };
          const active = virtualRow.index === activeIndex;

          return (
            <div
              ref={active ? activeRef : null}
              id={getListboxItemId(virtualRow.index)}
              role="option"
              aria-selected={active}
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              {...handlers}
            >
              <div
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
              >
                {cloneElement(
                  onRender({
                    item,
                    active,
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
