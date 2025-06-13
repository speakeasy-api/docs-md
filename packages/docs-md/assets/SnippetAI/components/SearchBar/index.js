import { jsx as i } from "react/jsx-runtime";
import { useKBar as c, VisualState as s } from "kbar";
const u = "kbar-listbox", d = (t) => `kbar-listbox-item-${t}`;
function f({ setInputValue: t, ...o }) {
  const { query: n, activeIndex: a, showing: r } = c((e) => ({
    search: e.searchQuery,
    currentRootActionId: e.currentRootActionId,
    actions: e.actions,
    activeIndex: e.activeIndex,
    showing: e.visualState === s.showing
  }));
  return /* @__PURE__ */ i(
    "input",
    {
      ...o,
      "data-testid": "code-words:input",
      ref: n.inputRefSetter,
      autoFocus: !0,
      autoComplete: "off",
      role: "textbox",
      spellCheck: "false",
      "aria-expanded": r,
      "aria-controls": u,
      "aria-activedescendant": d(a),
      onChange: (e) => {
        t(e.target.value);
      },
      onKeyDown: (e) => {
        o.onKeyDown?.(e);
      }
    }
  );
}
export {
  u as KBAR_LISTBOX,
  f as SearchBar,
  d as getListboxItemId
};
