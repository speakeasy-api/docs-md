export type {
  CommandBarProps as SnippetAIProps,
  ThemeType,
  SupportedCodeTheme,
} from '@/components/CommandBar';
export type { CODE_LANGUAGE } from '@/types/languages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommandBar as CommandBarComponent } from '@/components/CommandBar';
import type { CommandBarProps as SnippetAIProps } from '@/components/CommandBar';
import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient();

export const SnippetAI = (props: PropsWithChildren<SnippetAIProps>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CommandBarComponent {...props} />
    </QueryClientProvider>
  );
};
