import * as codeThemes from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { ReactNode } from 'react';

export declare type CODE_LANGUAGE = 'typescript' | 'python' | 'go' | 'java' | 'csharp' | 'php';

declare type CommandBarThemeOpts = {
    iconSrc: string;
    fontFamily: string;
    codeThemeDark: SupportedCodeTheme;
    codeThemeLight: SupportedCodeTheme;
    theme: ThemeType;
};

export declare const SnippetAI: (props: PropsWithChildren<SnippetAIProps>) => JSX_2.Element;

export declare type SnippetAIProps = {
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

export declare type SupportedCodeTheme = keyof typeof codeThemes;

export declare type ThemeType = 'dark' | 'light' | 'system';

export { }
