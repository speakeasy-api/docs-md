import { jsx as p } from "react/jsx-runtime";
import { useRef as x, useEffect as a, useCallback as L, cloneElement as S, useState as b } from "react";
import { useVirtual as D } from "react-virtual";
import { useKBar as M, KBAR_LISTBOX as P, getListboxItemId as K } from "kbar";
const u = -1;
function T() {
  const [c, s] = b(!1);
  return a(() => {
    function l() {
      s(!0);
    }
    if (!c)
      return window.addEventListener("pointermove", l), () => window.removeEventListener("pointermove", l);
  }, [c]), c;
}
const X = ({
  onRender: c,
  items: s,
  maxHeight: l,
  setQuery: g,
  setInputValue: m
}) => {
  const y = x(null), I = x(null), i = x(s);
  i.current = s;
  const f = D({
    size: i.current.length,
    parentRef: I
  }), { query: o, search: v, currentRootActionId: k, activeIndex: d, options: h } = M(
    (e) => ({
      search: e.searchQuery,
      currentRootActionId: e.currentRootActionId,
      activeIndex: e.activeIndex
    })
  );
  a(() => {
    const e = (t) => {
      t.isComposing || (t.key === "ArrowUp" || t.ctrlKey && t.key === "p" ? (t.preventDefault(), t.stopPropagation(), o.setActiveIndex((r) => {
        let n = r > u ? r - 1 : r;
        if (typeof i.current[n] == "string") {
          if (n === 0) return r;
          n -= 1;
        }
        return n;
      })) : t.key === "ArrowDown" || t.ctrlKey && t.key === "n" ? (t.preventDefault(), t.stopPropagation(), o.setActiveIndex((r) => {
        let n = r < i.current.length - 1 ? r + 1 : r;
        if (typeof i.current[n] == "string") {
          if (n === i.current.length - 1) return r;
          n += 1;
        }
        return n;
      })) : t.key === "Enter" && y.current?.click());
    };
    return window.addEventListener("keydown", e, { capture: !0 }), () => window.removeEventListener("keydown", e, { capture: !0 });
  }, [o]);
  const { scrollToIndex: A } = f;
  a(() => {
    A(d, {
      // ensure that if the first item in the list is a group
      // name and we are focused on the second item, to not
      // scroll past that group, hiding it.
      align: d <= 1 ? "end" : "auto"
    });
  }, [d, A]), a(() => {
    o.setActiveIndex(
      // avoid setting active index on a group
      typeof s[u] == "string" ? u + 1 : u
    );
  }, [v, k, s, o]);
  const w = L(
    (e) => {
      typeof e != "string" && (m(e.name), g(e.name), o.setCurrentRootAction(e.id), h.callbacks?.onSelectAction?.(e));
    },
    [h.callbacks, m, g, o]
  ), E = T();
  return /* @__PURE__ */ p(
    "div",
    {
      ref: I,
      style: {
        maxHeight: l || 400,
        position: "relative",
        overflow: "auto"
      },
      "data-testid": "code-words:suggestions-list",
      children: /* @__PURE__ */ p(
        "div",
        {
          role: "listbox",
          id: P,
          style: {
            height: `${f.totalSize}px`,
            width: "100%"
          },
          children: f.virtualItems.map((e) => {
            const t = i.current[e.index];
            if (!t) return null;
            const r = typeof t != "string" && {
              onPointerMove: () => E && d !== e.index && o.setActiveIndex(e.index),
              onPointerDown: () => {
                o.setActiveIndex(e.index), w(t);
              }
            }, n = e.index === d;
            return /* @__PURE__ */ p(
              "div",
              {
                ref: n ? y : null,
                id: K(e.index),
                role: "option",
                "aria-selected": n,
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${e.start}px)`
                },
                ...r,
                children: S(
                  c({
                    item: t,
                    active: n
                  }),
                  {
                    ref: e.measureRef
                  }
                )
              },
              e.index
            );
          })
        }
      )
    }
  );
};
export {
  X as SuggestionsList
};
