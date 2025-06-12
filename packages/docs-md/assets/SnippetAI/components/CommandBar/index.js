import C from "clsx";
import {
  KBarAnimator as K,
  KBarPortal as N,
  KBarPositioner as L,
  KBarProvider as D,
  useKBar as E,
} from "kbar";
import {
  useCallback as A,
  useEffect as x,
  useMemo as b,
  useState as S,
} from "react";
import { jsx as o, jsxs as d } from "react/jsx-runtime";
import M from "react-shadow";
import * as B from "react-syntax-highlighter/dist/esm/styles/hljs/index.js";

import G from "../../assets/images/speakeasy-logo.png.js";
import { CodeSampleSearchResults as F } from "../CodeSampleSearchResults/index.js";
import { SearchBar as q } from "../SearchBar/index.js";
import { Spinner as _ } from "../Spinner/index.js";
import { useSnippetAIQuery as R } from "./hooks/useCodeWords.js";
import { ShadowRootStyles as j } from "./styles/index.js";
const y = "atomOneDarkReasonable",
  O = "http://localhost:3000/api",
  U = {
    typescript: "TypeScript",
    python: "Python",
    go: "Golang",
    java: "Java",
    csharp: "C#",
    php: "PHP",
  },
  H = M.div,
  $ = ({
    codeLang: r,
    zIndex: n = "1000",
    theme: t,
    suggestions: i,
    isQueryLoading: s,
    queryResults: h,
    queryError: p,
    inputValue: a,
    setInputValue: l,
    query: u,
    setQuery: m,
  }) => {
    const {
        query: { toggle: f, registerActions: v },
      } = E((e) => ({
        search: e.searchQuery,
      })),
      k = b(
        () =>
          i?.map((e) => ({
            id: e,
            name: e,
          })) ?? [],
        [i]
      );
    x(
      () => () => {
        l(""), m("");
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ),
      x(() => {
        const e = v(k);
        return () => e();
      }, [v, k]);
    const P = A(
        (e) => {
          e.preventDefault(), e.stopPropagation(), m(a);
        },
        [a, m]
      ),
      c = b(
        () => ({
          iconSrc: G,
          theme: "system",
          fontFamily: "TWKEverett, sans-serif",
          codeThemeLight: y,
          codeThemeDark: y,
          ...t,
        }),
        [t]
      ),
      w =
        c.theme === "dark" ||
        (c.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches),
      g = w ? c.codeThemeDark : c.codeThemeLight,
      T = b(() => {
        let e = B[g];
        return (
          e ||
            (console.error(
              `Code theme "${g}" not found, falling back to default`
            ),
            (e = B[y])),
          e
        );
      }, [g]);
    return /* @__PURE__ */ d(H, {
      children: [
        /* @__PURE__ */ o(j, {}),
        /* @__PURE__ */ o(L, {
          className: "bg-black/70 px-4 pt-[2vh] sm:pt-[2vh] md:pt-[6vh]",
          style: { zIndex: n, padding: "ignore" },
          children: /* @__PURE__ */ d(K, {
            className: C(
              "CommandBarComponent-Animator flex w-full max-w-[100vw] flex-col overflow-hidden sm:max-w-[80vw] md:max-w-[70vw]",
              "rounded-lg bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
              w && "dark"
            ),
            style: { fontFamily: c.fontFamily, zIndex: n, padding: "ignore" },
            children: [
              /* @__PURE__ */ d("div", {
                id: "command-bar-container",
                className:
                  "flex w-full border-b border-solid border-b-neutral-200 dark:border-b-neutral-700",
                children: [
                  /* @__PURE__ */ d("form", {
                    onSubmit: P,
                    className: "flex flex-1 items-center px-7 py-5",
                    children: [
                      /* @__PURE__ */ o("img", {
                        src: c.iconSrc,
                        alt: "Company Logo",
                        className: "mr-2 max-w-5",
                      }),
                      /* @__PURE__ */ o(q, {
                        name: "codewords-search",
                        disabled: s,
                        placeholder: `Generate ${r ? U[r] + " " : ""}integration code`,
                        value: a,
                        setInputValue: l,
                        className:
                          "w-full flex-grow text-base outline-none focus-visible:outline-1 disabled:opacity-60",
                      }),
                      /* @__PURE__ */ o(_, { isLoading: s }),
                    ],
                  }),
                  /* @__PURE__ */ o("button", {
                    className: C(
                      "mx-3 my-4 cursor-pointer rounded-md bg-neutral-200 px-5 transition-colors hover:bg-neutral-300",
                      "dark:bg-neutral-700 dark:hover:bg-neutral-600"
                    ),
                    onClick: f,
                    title: "Press esc to close",
                    children: "Esc",
                  }),
                ],
              }),
              /* @__PURE__ */ o(F, {
                inputValue: a,
                query: u,
                isQueryLoading: s,
                queryResults: h,
                queryError: p,
                codeTheme: T,
                setInputValue: l,
                setQuery: m,
              }),
            ],
          }),
        }),
      ],
    });
  },
  J = ({ connectToggle: r, ...n }) => {
    const {
      query: { toggle: t },
    } = E();
    return (
      x(() => {
        r?.(t);
      }, [r, t]),
      /* @__PURE__ */ o(N, { children: /* @__PURE__ */ o($, { ...n }) })
    );
  },
  te = ({
    toggleShortcut: r,
    _specSrc: n,
    baseUrl: t,
    publishingToken: i,
    ...s
  }) => {
    const [h, p] = S(""),
      [a, l] = S(""),
      {
        isQueryLoading: u,
        queryResults: m,
        queryError: f,
      } = R(a, t ?? O, s.codeLang ?? "typescript", i ?? "", n);
    return /* @__PURE__ */ o(D, {
      options: {
        toggleShortcut: r || void 0,
      },
      children: /* @__PURE__ */ o(J, {
        inputValue: h,
        setInputValue: p,
        isQueryLoading: u,
        query: a,
        setQuery: l,
        queryResults: m,
        queryError: f,
        ...s,
      }),
    });
  };
export { te as CommandBar };
