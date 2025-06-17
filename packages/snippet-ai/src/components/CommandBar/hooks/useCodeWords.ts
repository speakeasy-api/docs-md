import { useQuery } from '@tanstack/react-query';

export type SnippetAIResponse = {
  code: string;
  explanation: string;
  lang: string;
};

export const UserError = class extends Error {
  type = 'user' as const;
};

const fetchSnippet = async (
  query: string,
  baseUrl: string,
  language: string,
  publishingToken: string,
  _specSrc?: string | null
): Promise<SnippetAIResponse | null> => {
  const urlParams = new URLSearchParams(
    _specSrc
      ? {
          lang: language,
          _specURL: _specSrc,
          prompt: query,
        }
      : {
          lang: language,
          prompt: query,
        }
  );

  const response = await fetch(
    `${baseUrl}/v1/snippet-ai?${urlParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer: ${publishingToken}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 400) {
      const responseBody = (await response.json()) as {
        error: { message: string };
      };
      const err = new UserError(
        responseBody?.error?.message ?? 'Unknown error'
      );
      throw err;
    }
    throw new Error('Failed to fetch snippets');
  }

  return (await response.json()) as SnippetAIResponse;
};

export const useSnippetAIQuery = (
  query: string,
  baseUrl: string,
  language: string,
  publishingToken: string,
  _specSrc?: string | null
) => {
  const { data, isLoading, error } = useQuery<SnippetAIResponse | null>({
    queryKey: [
      'snippet-ai',
      query,
      _specSrc,
      baseUrl,
      language,
      publishingToken,
    ],
    queryFn: async () =>
      await fetchSnippet(query, baseUrl, language, publishingToken, _specSrc),
    enabled: !!query,
    retry: false,
  });

  if (error) {
    return {
      queryResults: null,
      isQueryLoading: false,
      queryError: error,
    };
  }

  return {
    queryResults: data ?? null,
    isQueryLoading: isLoading,
    queryError: error,
  };
};
