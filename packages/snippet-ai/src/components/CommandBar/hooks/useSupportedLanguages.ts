import type { CODE_LANGUAGE } from '@/types/languages';
import { useQuery } from '@tanstack/react-query';

export type SupportedLanguagesResponse = {
  supportedLanguages: CODE_LANGUAGE[];
};

const fetchSupportedLanguages = async (
  baseUrl: string,
  publishingToken: string,
  codeLang?: string | null,
  _specSrc?: string | null
): Promise<SupportedLanguagesResponse | null> => {
  if (codeLang) {
    return null;
  }

  const params = _specSrc
    ? `?${new URLSearchParams({ _specURL: _specSrc }).toString()}`
    : '';

  const response = await fetch(`${baseUrl}/v1/spec-metadata${params}`, {
    headers: {
      Authorization: `Bearer: ${publishingToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch snippets');
  }

  return (await response.json()) as SupportedLanguagesResponse;
};

export const useSupportedLanguages = (
  baseUrl: string,
  publishingToken: string,
  codeLang?: CODE_LANGUAGE | null,
  _specSrc?: string | null
) => {
  const { data, isLoading, error } =
    useQuery<SupportedLanguagesResponse | null>({
      queryKey: ['snippet-ai', _specSrc, codeLang, baseUrl, publishingToken],
      queryFn: async () =>
        await fetchSupportedLanguages(
          baseUrl,
          publishingToken,
          codeLang,
          _specSrc
        ),
    });

  return {
    supportedLanguagesResult: data ?? null,
    isSupportedLanguagesLoading: isLoading,
    supportedLanguagesError: error,
  };
};
