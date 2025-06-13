import { jsx as e, jsxs as a } from "react/jsx-runtime";
import { Suggestions as h } from "../Suggestions/index.js";
import { CopyPasteButton as x } from "../CopyPasteButton/index.js";
import l from "react-markdown";
import { CodeSample as g } from "./CodeSample.js";
import { SpeakeasyLogo as f } from "../../assets/images/logo.js";
const d = ({ title: t }) => /* @__PURE__ */ e("h2", { className: "mb-4 border-b border-solid border-b-gray-200 pb-2 pl-2 text-xl font-bold dark:border-b-neutral-700", children: t }), o = ({ children: t }) => /* @__PURE__ */ e("div", { className: "px-8 py-6", children: t }), b = () => /* @__PURE__ */ a("div", { className: "mt-4 flex items-center text-sm text-neutral-600 dark:text-neutral-400", children: [
  /* @__PURE__ */ e("div", { className: "grow", children: "* AI generated code is currently experimental" }),
  /* @__PURE__ */ a(
    "a",
    {
      href: "https://speakeasy.com",
      target: "_blank",
      className: "mx-1 flex items-center",
      rel: "noreferrer",
      children: [
        "Powered by Speakeasy",
        /* @__PURE__ */ e(f, { className: "ml-1 h-[1.2rem] w-[1.2rem]" })
      ]
    }
  )
] }), P = ({
  inputValue: t,
  query: n,
  isQueryLoading: c,
  queryResults: r,
  queryError: i,
  codeTheme: m,
  setInputValue: s,
  setQuery: p
}) => (
  // First, check if there are changes between the last searched query and the
  // current input value, aka check if it's stale. If the query is stale, then
  // that means the user has moved on from their previous query and we want to
  // show suggestions instead
  n !== t || // Next, check if we have a query+results to show. `query` will be false and
  // `inputValue` will be false when code words first loads and everything is
  // empty, in which case we want to show suggestions as a jump start
  !n || // Now check if the query is loading and there's no error. In this case
  // we're already showing the spinner in the input bar, but otherwise want to
  // keep ths UI stable until we're done loading
  !i && c || // Lastly, make sure that query results exist as a catch-all. We _probably_
  // will never get to this check, but you never know
  !r ? /* @__PURE__ */ e(h, { setInputValue: s, setQuery: p }) : i ? /* @__PURE__ */ e(o, { children: "There was an error fetching your results. Please try again." }) : !r.code || r.code.length <= 0 && r.explanation ? /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(l, { children: r.explanation }) }) : /* @__PURE__ */ a(o, { children: [
    r.code && r.code.length > 0 && /* @__PURE__ */ e(d, { title: "Description" }),
    /* @__PURE__ */ e("div", { className: "mb-4 ml-2 text-sm", children: /* @__PURE__ */ e(l, { children: r.explanation }) }),
    /* @__PURE__ */ e(d, { title: "Code" }),
    /* @__PURE__ */ a("div", { className: "relative", children: [
      /* @__PURE__ */ e("div", { className: "absolute top-3 right-5 z-10", children: /* @__PURE__ */ e(x, { textToCopy: r.code }) }),
      /* @__PURE__ */ e(
        g,
        {
          code: r.code,
          language: r.lang,
          codeTheme: m
        }
      )
    ] }),
    /* @__PURE__ */ e(b, {})
  ] })
);
export {
  P as CodeSampleSearchResults
};
