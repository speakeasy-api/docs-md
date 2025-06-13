import { jsxs as l, jsx as s } from "react/jsx-runtime";
import { forwardRef as i, useMemo as m, Fragment as c } from "react";
import p from "clsx";
const o = i(
  ({
    action: e,
    // active,
    currentRootActionId: n
  }, d) => {
    const a = m(() => {
      if (!n) return e.ancestors;
      const r = e.ancestors.findIndex(
        (t) => t.id === n
      );
      return e.ancestors.slice(r + 1);
    }, [e.ancestors, n]);
    return /* @__PURE__ */ l(
      "div",
      {
        ref: d,
        className: p(
          "flex cursor-pointer items-center justify-between border-l-4 border-solid px-4 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-800",
          // TODO: add this back when we replace kbar with cmd+k and get proper keyboard accessibility
          /*active
            ? 'border-l-neutral-400 dark:border-l-neutral-600'
            :*/
          "border-l-transparent"
        ),
        children: [
          /* @__PURE__ */ l("div", { className: "flex items-center gap-2 text-sm", children: [
            e.icon && e.icon,
            /* @__PURE__ */ l("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ l("div", { children: [
                a.length > 0 && a.map((r) => /* @__PURE__ */ l(c, { children: [
                  /* @__PURE__ */ s("span", { className: "mr-2 opacity-50", children: r.name }),
                  /* @__PURE__ */ s("span", { className: "mr-2", children: "›" })
                ] }, r.id)),
                /* @__PURE__ */ s("span", { children: e.name })
              ] }),
              e.subtitle && /* @__PURE__ */ s("span", { className: "text-xs", children: e.subtitle })
            ] })
          ] }),
          e.shortcut?.length ? /* @__PURE__ */ s("div", { "aria-hidden": !0, className: "grid grid-flow-col gap-1", children: e.shortcut.map((r) => /* @__PURE__ */ s(
            "kbd",
            {
              className: "rounded-sm bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-900",
              children: r
            },
            r
          )) }) : null
        ]
      }
    );
  }
);
o.displayName = "SuggestionItem";
export {
  o as SuggestionItem
};
