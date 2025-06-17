// Use the light version to avoid loading languages we won't use and bloating the bundle by ~200kb
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import type { CODE_LANGUAGE } from '@/types/languages';
import type { CSSProperties } from 'react';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('php', php);

export type CodeSampleProps = {
  language: CODE_LANGUAGE;
  code: string;
  codeTheme: CodeThemeType;
  className?: string;
};

export type CodeThemeType = Record<string, CSSProperties>;

export const CodeSample = ({
  language,
  code,
  className,
  codeTheme,
}: CodeSampleProps) => (
  <SyntaxHighlighter
    data-testid="code-words:code-sample"
    showLineNumbers
    language={language}
    style={codeTheme}
    // TODO: would prefer to use Tailwind for consistency, but would
    // have to pass in something custom for `PreTag` and I don't wanna
    // mess with it now :-P
    customStyle={{
      borderRadius: '.5rem',
      margin: '0 8px',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      maxHeight: '50vh',
    }}
    className={className}
  >
    {code}
  </SyntaxHighlighter>
);
