import { useQuery as u } from "@tanstack/react-query";
const p = async (r, a, t, e) => {
  if (t)
    return null;
  const s = e ? `?${new URLSearchParams({ _specURL: e }).toString()}` : "", o = await fetch(
    `${r}/v1/spec-metadata${s}`,
    {
      headers: {
        Authorization: `Bearer: ${a}`
      }
    }
  );
  if (!o.ok)
    throw new Error("Failed to fetch code words");
  return await o.json();
}, d = (r, a, t, e) => {
  const { data: s, isLoading: o, error: n } = u({
    queryKey: ["snippet-ai", e, t, r, a],
    queryFn: async () => await p(r, a, t, e)
  });
  return {
    supportedLanguagesResult: s ?? null,
    isSupportedLanguagesLoading: o,
    supportedLanguagesError: n
  };
};
export {
  d as useSupportedLanguages
};
