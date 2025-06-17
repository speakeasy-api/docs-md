import { useMatches } from 'kbar';
import { SuggestionItem } from './SuggestionItem';
import { SuggestionsList } from './SuggestionsList';

interface SuggestionsProps {
  setInputValue: (inputValue: string) => void;
  setQuery: (submittedQuery: string) => void;
}

export const Suggestions = ({ setInputValue, setQuery }: SuggestionsProps) => {
  const { results, rootActionId } = useMatches();

  return (
    <SuggestionsList
      setInputValue={setInputValue}
      setQuery={setQuery}
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="list-none px-4 py-2 text-xs uppercase opacity-50">
            {item}
          </div>
        ) : (
          <SuggestionItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ''}
          />
        )
      }
    />
  );
};
