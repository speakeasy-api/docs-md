import type { InputHTMLAttributes } from 'react';
import { useKBar, VisualState } from 'kbar';

export const KBAR_LISTBOX = 'kbar-listbox';
export const getListboxItemId = (id: number) => `kbar-listbox-item-${id}`;

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  setInputValue: (newQuery: string) => void;
};

export function SearchBar({ setInputValue, ...props }: SearchBarProps) {
  const { query, activeIndex, showing } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
    actions: state.actions,
    activeIndex: state.activeIndex,
    showing: state.visualState === VisualState.showing,
  }));

  return (
    <input
      {...props}
      data-testid="code-words:input"
      ref={query.inputRefSetter}
      autoFocus
      autoComplete="off"
      role="textbox"
      spellCheck="false"
      aria-expanded={showing}
      aria-controls={KBAR_LISTBOX}
      aria-activedescendant={getListboxItemId(activeIndex)}
      onChange={(event) => {
        setInputValue(event.target.value);
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
      }}
    />
  );
}
