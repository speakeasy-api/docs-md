import { useQuery as p } from "@tanstack/react-query";
const c = async (r, o, t, n, e) => {
  const s = new URLSearchParams(e ? {
    lang: t,
    _specURL: e,
    prompt: r
  } : {
    lang: t,
    prompt: r
  }), a = await fetch(
    `${o}/v1/snippet-ai?${s.toString()}`,
    {
      headers: {
        Authorization: `Bearer: ${n}`
      }
    }
  );
  if (!a.ok)
    throw new Error("Failed to fetch code words");
  return await a.json();
}, d = (r, o, t, n, e) => {
  const { data: s, isLoading: a, error: i } = p({
    queryKey: ["snippet-ai", r, e, o, t, n],
    queryFn: async () => await c(r, o, t, n, e),
    enabled: !!r
  });
  return {
    queryResults: s ?? null,
    isQueryLoading: a,
    queryError: i
  };
};
export {
  d as useSnippetAIQuery
};
