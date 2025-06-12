import { useQuery as p } from "@tanstack/react-query";
const u = async (r, o, t, n, e) => {
  if (!r)
    return null;
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
    queryFn: async () => await u(r, o, t, n, e)
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
