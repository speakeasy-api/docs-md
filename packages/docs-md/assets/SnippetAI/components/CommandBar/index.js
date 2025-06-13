import { jsx as o, jsxs as h, Fragment as R } from "react/jsx-runtime";
import { useState as C, useEffect as f, useCallback as T, useMemo as g, Children as j, cloneElement as q } from "react";
import { KBarProvider as U, useKBar as F, KBarPortal as _, KBarPositioner as M, KBarAnimator as H } from "kbar";
import { SearchBar as O } from "../SearchBar/index.js";
import { useSnippetAIQuery as $ } from "./hooks/useCodeWords.js";
import { CodeSampleSearchResults as J } from "../CodeSampleSearchResults/index.js";
import W from "../../assets/images/speakeasy-logo.png.js";
import { Spinner as Y } from "../Spinner/index.js";
import { ShadowRootStyles as I } from "./styles/index.js";
import X from "react-shadow";
import A from "clsx";
import * as N from "react-syntax-highlighter/dist/esm/styles/hljs/index.js";
import { useSupportedLanguages as Z } from "./hooks/useSupportedLanguages.js";
import { Select as z } from "../Select/index.js";
const w = "atomOneDarkReasonable", B = "typescript", D = "https://snippet-ai.speakeasy-cloud.com/api", P = {
  typescript: "TypeScript",
  python: "Python",
  go: "Golang",
  java: "Java",
  csharp: "C#",
  php: "PHP"
}, Q = X.div, V = ({
  zIndex: n = "1000",
  theme: s,
  suggestions: d,
  isQueryLoading: r,
  queryResults: t,
  queryError: u,
  inputValue: l,
  setInputValue: p,
  query: x,
  setQuery: i,
  languageOptions: c,
  onSelectLanguage: y,
  queryLanguage: a
}) => {
  const {
    query: { toggle: L, registerActions: b }
  } = F((e) => ({
    search: e.searchQuery
  })), v = g(() => d?.map((e) => ({
    id: e,
    name: e
  })) ?? [], [d]);
  f(
    () => () => {
      p(""), i("");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  ), f(() => {
    const e = b(v);
    return () => e();
  }, [b, v]);
  const S = T(
    (e) => {
      e.preventDefault(), e.stopPropagation(), i(l);
    },
    [l, i]
  ), m = g(
    () => ({
      iconSrc: W,
      theme: "system",
      fontFamily: "TWKEverett, sans-serif",
      codeThemeLight: w,
      codeThemeDark: w,
      ...s
    }),
    [s]
  ), E = m.theme === "dark" || m.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches, k = E ? m.codeThemeDark : m.codeThemeLight, G = g(() => {
    let e = N[k];
    return e || (console.error(
      `Code theme "${k}" not found, falling back to default`
    ), e = N[w]), e;
  }, [k]), K = g(() => c?.map((e) => ({
    value: e,
    label: P[e] ?? e
  })) ?? [], [c]);
  return /* @__PURE__ */ h(Q, { children: [
    /* @__PURE__ */ o(I, {}),
    /* @__PURE__ */ o(
      M,
      {
        className: "bg-black/70 px-4 pt-[2vh] sm:pt-[2vh] md:pt-[6vh]",
        style: { zIndex: n, padding: "ignore" },
        children: /* @__PURE__ */ h(
          H,
          {
            className: A(
              "CommandBarComponent-Animator flex w-full max-w-[100vw] flex-col overflow-hidden sm:max-w-[80vw] md:max-w-[70vw]",
              "rounded-lg bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
              E && "dark"
            ),
            style: { fontFamily: m.fontFamily, zIndex: n, padding: "ignore" },
            children: [
              /* @__PURE__ */ h(
                "div",
                {
                  id: "command-bar-container",
                  className: "flex flex-col border-b border-solid border-b-neutral-200 dark:border-b-neutral-700",
                  children: [
                    /* @__PURE__ */ h("div", { className: "flex", children: [
                      /* @__PURE__ */ h(
                        "form",
                        {
                          onSubmit: S,
                          className: "flex flex-1 items-center px-7 py-5",
                          children: [
                            /* @__PURE__ */ o(
                              "img",
                              {
                                src: m.iconSrc,
                                alt: "Company Logo",
                                className: "mr-2 max-w-5"
                              }
                            ),
                            /* @__PURE__ */ o(
                              O,
                              {
                                name: "codewords-search",
                                disabled: r,
                                placeholder: `Generate ${a ? P[a] + " " : ""}integration code`,
                                value: l,
                                setInputValue: p,
                                className: "w-full flex-grow text-base outline-none focus-visible:outline-1 disabled:opacity-60"
                              }
                            ),
                            /* @__PURE__ */ o(Y, { isLoading: r })
                          ]
                        }
                      ),
                      /* @__PURE__ */ o(
                        "button",
                        {
                          className: A(
                            "mx-3 my-4 cursor-pointer rounded-md bg-neutral-200 px-5 transition-colors hover:bg-neutral-300",
                            "dark:bg-neutral-700 dark:hover:bg-neutral-600"
                          ),
                          onClick: L,
                          title: "Press esc to close",
                          children: "Esc"
                        }
                      )
                    ] }),
                    c && c.length > 0 && !r && /* @__PURE__ */ o(
                      z,
                      {
                        options: K,
                        className: "mx-4 mb-3 justify-self-start",
                        value: a ?? void 0,
                        label: "Language",
                        placeholder: "Select a language",
                        onChange: y
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ o(
                J,
                {
                  inputValue: l,
                  query: x,
                  isQueryLoading: r,
                  queryResults: t,
                  queryError: u,
                  codeTheme: G,
                  setInputValue: p,
                  setQuery: i
                }
              )
            ]
          }
        )
      }
    )
  ] });
}, ee = ({
  children: n,
  connectToggle: s,
  ...d
}) => {
  const {
    query: { toggle: r }
  } = F();
  f(() => {
    s?.(r);
  }, [s, r]);
  const t = g(() => j.map(n, (u, l) => l === 0 ? q(u, {
    onClick: r
  }) : u), [n, r]);
  return /* @__PURE__ */ h(R, { children: [
    t,
    /* @__PURE__ */ o(_, { children: /* @__PURE__ */ o(V, { ...d }) })
  ] });
}, he = ({
  _specSrc: n,
  baseUrl: s,
  publishingToken: d,
  toggleShortcut: r,
  ...t
}) => {
  const [u, l] = C(""), [p, x] = C(""), [i, c] = C(
    t.codeLang ?? B
  ), { isSupportedLanguagesLoading: y, supportedLanguagesResult: a } = Z(
    s ?? D,
    d ?? "",
    t.codeLang,
    n
  ), { isQueryLoading: L, queryResults: b, queryError: v } = $(
    p,
    s ?? D,
    i,
    d ?? "",
    n
  );
  f(() => {
    c(t.codeLang ?? B);
  }, [t.codeLang]), f(() => {
    a && a.supportedLanguages.length > 0 && c(a.supportedLanguages[0]);
  }, [a]);
  const S = T((m) => {
    c(m);
  }, []);
  return /* @__PURE__ */ o(
    U,
    {
      options: {
        toggleShortcut: r || void 0
      },
      children: /* @__PURE__ */ o(
        ee,
        {
          inputValue: u,
          setInputValue: l,
          isQueryLoading: L || y,
          query: p,
          setQuery: x,
          queryResults: b,
          queryError: v,
          queryLanguage: i,
          onSelectLanguage: S,
          languageOptions: a?.supportedLanguages,
          ...t
        }
      )
    }
  );
};
export {
  he as CommandBar
};
