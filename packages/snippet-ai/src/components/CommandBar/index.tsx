import type { FormEvent, ReactElement, ReactNode } from 'react';
import type { SnippetAIResponse } from './hooks/useCodeWords';
import type { CODE_LANGUAGE } from '@/types/languages';
import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  cloneElement,
  Children,
} from 'react';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  useKBar,
} from 'kbar';
import { SearchBar } from '@/components/SearchBar';
import { useSnippetAIQuery } from './hooks/useCodeWords';
import { CodeSampleSearchResults } from '@/components/CodeSampleSearchResults';
import SpeakeasyLogo from '@/assets/images/speakeasy-logo.png';
import { Spinner } from '@/components/Spinner';
import { ShadowRootStyles } from './styles';
import root from 'react-shadow';
import clsx from 'clsx';

import * as codeThemes from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useSupportedLanguages } from './hooks/useSupportedLanguages';
import { Select } from '../Select';

export type SupportedCodeTheme = keyof typeof codeThemes;

// Dark theme looks better even in light mode, so we just use this one default
const DEFAULT_CODE_THEME = 'atomOneDarkReasonable';
// This is set as the fallback
const DEFAULT_LANGUAGE: CODE_LANGUAGE = 'typescript';

export type CommandBarProps = {
  _specSrc?: string | null;
  baseUrl?: string | null;
  children?: ReactNode;
  codeLang?: CODE_LANGUAGE | null;
  connectToggle?: (toggle: () => void) => void;
  publishingToken: string;
  suggestions?: string[] | null;
  theme?: Partial<CommandBarThemeOpts>;
  toggleShortcut?: string | null;
  zIndex?: string;
};

export type ThemeType = 'dark' | 'light' | 'system';

type CommandBarThemeOpts = {
  iconSrc: string; // TODO ? do we need
  fontFamily: string;
  codeThemeDark: SupportedCodeTheme;
  codeThemeLight: SupportedCodeTheme;
  theme: ThemeType;
};

type CommandBarPortalProps = Omit<
  CommandBarProps,
  'toggleShortcut' | '_specSrc' | 'publishingToken' | 'codeLang'
> & {
  languageOptions?: CODE_LANGUAGE[];
  inputValue: string;
  isQueryLoading: boolean;
  onSelectLanguage: (language: CODE_LANGUAGE) => void;
  query: string;
  queryError: Error | null;
  queryLanguage: CODE_LANGUAGE;
  queryResults: SnippetAIResponse | null;
  setInputValue: (inputValue: string) => void;
  setQuery: (submittedQuery: string) => void;
};

type CommandBarContentsProps = Omit<CommandBarPortalProps, 'connectToggle'>;

const defaultBaseUrl = process.env.SNIPPET_AI_SERVER ?? 'localhost:3000';

const DISPLAY_CODE_LANGUAGE: Record<CODE_LANGUAGE, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  go: 'Golang',
  java: 'Java',
  csharp: 'C#',
  php: 'PHP',
};

// Root is defined as a Record with string keys, not a fixed list of elements,
// which means that the type returned is `React.ComponentType | undefined`, not
// `React.ComponentType`, so we alias it here with a ! to get the correct type
const ShadowRoot = root.div!;

// We need a `useEffect` to run whenever the command bar is closed, which means
// this component must be inside the portal, hence this sub-component
const CommandBarContents = ({
  zIndex = '1000',
  theme: userTheme,
  suggestions,
  isQueryLoading,
  queryResults,
  queryError,
  inputValue,
  setInputValue,
  query,
  setQuery,
  languageOptions,
  onSelectLanguage,
  queryLanguage,
}: CommandBarContentsProps) => {
  const {
    query: { toggle, registerActions },
  } = useKBar((state) => ({
    search: state.searchQuery,
  }));

  const suggestionsActions = useMemo(() => {
    return (
      suggestions?.map((suggestion) => ({
        id: suggestion,
        name: suggestion,
      })) ?? []
    );
  }, [suggestions]);

  // Unfortunately kbar's built-in `onClose` callback doesn't get called when we
  // programmatically call `toggle` for some reason. We use this useEffect instead
  useEffect(
    () => () => {
      setInputValue('');
      setQuery('');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const unregister = registerActions(suggestionsActions);
    return () => unregister();
  }, [registerActions, suggestionsActions]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setQuery(inputValue);
    },
    [inputValue, setQuery]
  );

  const theme: CommandBarThemeOpts = useMemo(
    () => ({
      iconSrc: SpeakeasyLogo,
      theme: 'system',
      fontFamily: 'TWKEverett, sans-serif',
      codeThemeLight: DEFAULT_CODE_THEME,
      codeThemeDark: DEFAULT_CODE_THEME,
      ...userTheme,
    }),
    [userTheme]
  );

  const isDark =
    theme.theme === 'dark' ||
    (theme.theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  const codeThemeName = isDark ? theme.codeThemeDark : theme.codeThemeLight;

  // Try to load the theme, but if it doesn't exist fall back to the default
  const codeTheme = useMemo(() => {
    let codeTheme = codeThemes[codeThemeName];
    if (!codeTheme) {
      console.error(
        `Code theme "${codeThemeName}" not found, falling back to default`
      );
      codeTheme = codeThemes[DEFAULT_CODE_THEME];
    }
    return codeTheme;
  }, [codeThemeName]);

  const languageSelectOptions = useMemo(() => {
    return (
      languageOptions?.map((language) => ({
        value: language,
        label: DISPLAY_CODE_LANGUAGE[language] ?? language,
      })) ?? []
    );
  }, [languageOptions]);

  return (
    <ShadowRoot>
      {/* Shadow root styles must exist in a style tag inside the shadow
              root, meaning we can't do a normal `import styles from ` and
              instead have to do this indirection */}
      <ShadowRootStyles />
      <KBarPositioner
        className="bg-black/70 px-4 pt-[2vh] sm:pt-[2vh] md:pt-[6vh]"
        style={{ zIndex, padding: 'ignore' }}
      >
        <KBarAnimator
          className={clsx(
            'CommandBarComponent-Animator flex w-full max-w-[100vw] flex-col overflow-hidden sm:max-w-[80vw] md:max-w-[70vw]',
            'rounded-lg bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
            isDark && 'dark'
          )}
          style={{ fontFamily: theme.fontFamily, zIndex, padding: 'ignore' }}
        >
          <div
            id="command-bar-container"
            className="flex flex-col border-b border-solid border-b-neutral-200 dark:border-b-neutral-700"
          >
            <div className="flex">
              <form
                onSubmit={handleSubmit}
                className="flex flex-1 items-center px-7 py-5"
              >
                <img
                  src={theme.iconSrc}
                  alt="Company Logo"
                  className="mr-2 max-w-5"
                />
                <SearchBar
                  name="codewords-search"
                  disabled={isQueryLoading}
                  placeholder={`Generate ${queryLanguage ? DISPLAY_CODE_LANGUAGE[queryLanguage] + ' ' : ''}integration code`}
                  value={inputValue}
                  setInputValue={setInputValue}
                  // Note: we currently have an integration test that queries
                  // line-height of this component to test that the shadow root
                  // is functioning correctly. It relies on line-height not
                  // being set here, so if you need to set line-height, make
                  // sure to update index.html and the shadow root integration
                  // test to use another unused CSS property
                  className="w-full flex-grow text-base outline-none focus-visible:outline-1 disabled:opacity-60"
                />
                <Spinner isLoading={isQueryLoading} />
              </form>
              <button
                className={clsx(
                  'mx-3 my-4 cursor-pointer rounded-md bg-neutral-200 px-5 transition-colors hover:bg-neutral-300',
                  'dark:bg-neutral-700 dark:hover:bg-neutral-600'
                )}
                onClick={toggle}
                title="Press esc to close"
              >
                Esc
              </button>
            </div>
            {
              // When we don't have any language options, we don't want to show the language select
              // We also don't want to show it when the query is loading
            }
            {languageOptions &&
              languageOptions.length > 0 &&
              !isQueryLoading && (
                <Select<CODE_LANGUAGE>
                  options={languageSelectOptions}
                  className="mx-4 mb-3 justify-self-start"
                  value={queryLanguage ?? undefined}
                  label="Language"
                  placeholder="Select a language"
                  onChange={onSelectLanguage}
                />
              )}
          </div>
          <CodeSampleSearchResults
            inputValue={inputValue}
            query={query}
            isQueryLoading={isQueryLoading}
            queryResults={queryResults}
            queryError={queryError}
            codeTheme={codeTheme}
            setInputValue={setInputValue}
            setQuery={setQuery}
          />
        </KBarAnimator>
      </KBarPositioner>
    </ShadowRoot>
  );
};

// We need to call the useKbar() hook, which has to happen in a component inside
// the kbar provider, which is why this is pulled out of `CommandBar`
const CommandBarPortal = ({
  children,
  connectToggle,
  ...props
}: CommandBarPortalProps) => {
  const {
    query: { toggle },
  } = useKBar();

  useEffect(() => {
    connectToggle?.(toggle);
  }, [connectToggle, toggle]);

  const renderChildren = useMemo(() => {
    return Children.map(children, (child, index) => {
      if (index === 0) {
        return cloneElement(child as ReactElement, {
          onClick: toggle,
        });
      }
      return child;
    });
  }, [children, toggle]);

  return (
    <>
      {renderChildren}
      <KBarPortal>
        <CommandBarContents {...props} />
      </KBarPortal>
    </>
  );
};

export const CommandBar = ({
  _specSrc,
  baseUrl,
  publishingToken,
  toggleShortcut,
  ...props
}: CommandBarProps) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<CODE_LANGUAGE>(
    props.codeLang ?? DEFAULT_LANGUAGE
  );

  const { isSupportedLanguagesLoading, supportedLanguagesResult } =
    useSupportedLanguages(
      baseUrl ?? defaultBaseUrl,
      publishingToken ?? '',
      props.codeLang,
      _specSrc
    );

  const { isQueryLoading, queryResults, queryError } = useSnippetAIQuery(
    query,
    baseUrl ?? defaultBaseUrl,
    language,
    publishingToken ?? '',
    _specSrc
  );

  useEffect(() => {
    setLanguage(props.codeLang ?? DEFAULT_LANGUAGE);
  }, [props.codeLang]);

  useEffect(() => {
    if (
      supportedLanguagesResult &&
      supportedLanguagesResult.supportedLanguages.length > 0
    ) {
      // By default, set the language to the first supported language
      setLanguage(supportedLanguagesResult.supportedLanguages[0]!);
    }
  }, [supportedLanguagesResult]);

  const handleSelectLanguage = useCallback((language: CODE_LANGUAGE) => {
    setLanguage(language);
  }, []);

  return (
    <KBarProvider
      options={{
        toggleShortcut: toggleShortcut || undefined,
      }}
    >
      <CommandBarPortal
        inputValue={inputValue}
        setInputValue={setInputValue}
        isQueryLoading={isQueryLoading || isSupportedLanguagesLoading}
        query={query}
        setQuery={setQuery}
        queryResults={queryResults}
        queryError={queryError}
        queryLanguage={language}
        onSelectLanguage={handleSelectLanguage}
        languageOptions={supportedLanguagesResult?.supportedLanguages}
        {...props}
      />
    </KBarProvider>
  );
};
