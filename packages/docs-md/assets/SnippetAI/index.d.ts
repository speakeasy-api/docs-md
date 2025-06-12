import * as codeThemes from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';

export declare type CODE_LANGUAGE = 'typescript' | 'python' | 'go' | 'java' | 'csharp' | 'php';

export declare type CodeWordsProps = {
    _specSrc?: string | null;
    baseUrl?: string | null;
    suggestions?: string[] | null;
    codeLang: CODE_LANGUAGE | null;
    toggleShortcut?: string | null;
    zIndex?: string;
    publishingToken: string;
    connectToggle?: (toggle: () => void) => void;
    theme?: Partial<CommandBarThemeOpts>;
};

declare type CommandBarThemeOpts = {
    iconSrc: string;
    fontFamily: string;
    codeThemeDark: SupportedCodeTheme;
    codeThemeLight: SupportedCodeTheme;
    theme: ThemeType;
};

export declare const SnippetAI: (props: PropsWithChildren<CodeWordsProps>) => JSX_2.Element;

export declare type SupportedCodeTheme = keyof typeof codeThemes;

export declare type ThemeType = 'dark' | 'light' | 'system';

export { }
