import { jsx as o } from "react/jsx-runtime";
import { useMatches as c } from "kbar";
import { SuggestionItem as p } from "./SuggestionItem.js";
import { SuggestionsList as m } from "./SuggestionsList.js";
const f = ({ setInputValue: s, setQuery: r }) => {
  const { results: e, rootActionId: n } = c();
  return /* @__PURE__ */ o(
    m,
    {
      setInputValue: s,
      setQuery: r,
      items: e,
      onRender: ({ item: t, active: i }) => typeof t == "string" ? /* @__PURE__ */ o("div", { className: "list-none px-4 py-2 text-xs uppercase opacity-50", children: t }) : /* @__PURE__ */ o(
        p,
        {
          action: t,
          active: i,
          currentRootActionId: n ?? ""
        }
      )
    }
  );
};
export {
  f as Suggestions
};
