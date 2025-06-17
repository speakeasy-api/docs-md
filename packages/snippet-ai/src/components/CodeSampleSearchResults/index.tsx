import { Suggestions } from '@/components/Suggestions';
import { CopyPasteButton } from '@/components/CopyPasteButton';
import Markdown from 'react-markdown';
import type { CodeThemeType } from './CodeSample';
import { CodeSample } from './CodeSample';
import {
  UserError,
  type SnippetAIResponse,
} from '../CommandBar/hooks/useCodeWords';
import type { ReactNode } from 'react';
import type { CODE_LANGUAGE } from '@/types/languages';
import { SpeakeasyLogo } from '@/assets/images/logo';

export type CodeSampleSearchResultsProps = {
  inputValue: string;
  query: string;
  isQueryLoading: boolean;
  queryResults: SnippetAIResponse | null;
  queryError: Error | null;
  codeTheme: CodeThemeType;
  setInputValue: (inputValue: string) => void;
  setQuery: (submittedQuery: string) => void;
};

const SectionHeading = ({ title }: { title: string }) => {
  return (
    <h2 className="mb-4 border-b border-solid border-b-gray-200 pb-2 pl-2 text-xl font-bold dark:border-b-neutral-700">
      {title}
    </h2>
  );
};

const ResultsContainer = ({ children }: { children: ReactNode }) => {
  return <div className="px-8 py-6">{children}</div>;
};

const CodeSampleFooter = () => {
  return (
    <div className="mt-4 flex items-center text-sm text-neutral-600 dark:text-neutral-400">
      <div className="grow">* AI generated code is currently experimental</div>
      <a
        href="https://speakeasy.com"
        target="_blank"
        className="mx-1 flex items-center"
        rel="noreferrer"
      >
        Powered by Speakeasy
        <SpeakeasyLogo className="ml-1 h-[1.2rem] w-[1.2rem]" />
      </a>
    </div>
  );
};

export const CodeSampleSearchResults = ({
  inputValue,
  query,
  isQueryLoading,
  queryResults,
  queryError,
  codeTheme,
  setInputValue,
  setQuery,
}: CodeSampleSearchResultsProps) => {
  if (queryError) {
    const message =
      queryError instanceof UserError
        ? queryError.message
        : 'There was an error fetching your results. Please try again.';
    console.log(queryError);
    return <ResultsContainer>{message}</ResultsContainer>;
  }

  // Check if we're able to show results
  if (
    // First, check if there are changes between the last searched query and the
    // current input value, aka check if it's stale. If the query is stale, then
    // that means the user has moved on from their previous query and we want to
    // show suggestions instead
    query !== inputValue ||
    // Next, check if we have a query+results to show. `query` will be false and
    // `inputValue` will be false when code words first loads and everything is
    // empty, in which case we want to show suggestions as a jump start
    !query ||
    // Now check if the query is loading and there's no error. In this case
    // we're already showing the spinner in the input bar, but otherwise want to
    // keep ths UI stable until we're done loading
    (!queryError && isQueryLoading) ||
    // Lastly, make sure that query results exist as a catch-all. We _probably_
    // will never get to this check, but you never know
    !queryResults
  ) {
    return <Suggestions setInputValue={setInputValue} setQuery={setQuery} />;
  }

  if (
    !queryResults.code ||
    (queryResults.code.length <= 0 && queryResults.explanation)
  ) {
    return (
      <ResultsContainer>
        <Markdown>{queryResults.explanation}</Markdown>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      {queryResults.code && queryResults.code.length > 0 && (
        <SectionHeading title="Description" />
      )}
      <div className="mb-4 ml-2 text-sm">
        <Markdown>{queryResults.explanation}</Markdown>
      </div>
      <SectionHeading title="Code" />
      <div className="relative">
        <div className="absolute top-3 right-5 z-10">
          <CopyPasteButton textToCopy={queryResults.code} />
        </div>
        <CodeSample
          code={queryResults.code}
          language={queryResults.lang as CODE_LANGUAGE}
          codeTheme={codeTheme}
        />
      </div>
      <CodeSampleFooter />
    </ResultsContainer>
  );
};
