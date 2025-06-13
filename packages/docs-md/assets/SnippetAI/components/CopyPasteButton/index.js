import { jsx as e, jsxs as a, Fragment as i } from "react/jsx-runtime";
import { useState as c, useCallback as p } from "react";
import { Check as d, Copy as u } from "lucide-react";
import m from "clsx";
const f = ({
  textToCopy: r,
  className: n
}) => {
  const [t, o] = c(!1), l = p(() => {
    navigator.clipboard.writeText(r).then(() => {
      o(!0), setTimeout(() => {
        o(!1);
      }, 3e3);
    }).catch((s) => console.error("Failed to copy text: ", s));
  }, [r]);
  return /* @__PURE__ */ e(
    "button",
    {
      onClick: l,
      className: m(
        "flex cursor-pointer items-center gap-2 rounded-md bg-neutral-200 p-2 text-neutral-800 transition-colors hover:bg-neutral-300",
        "dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600",
        n
      ),
      "aria-label": t ? "Copied!" : "Copy to clipboard",
      title: t ? "Copied!" : "Copy to clipboard",
      children: t ? /* @__PURE__ */ a(i, { children: [
        /* @__PURE__ */ e(d, { size: 16 }),
        /* @__PURE__ */ e("span", { children: "Copied!" })
      ] }) : /* @__PURE__ */ a(i, { children: [
        /* @__PURE__ */ e(u, { size: 16 }),
        /* @__PURE__ */ e("span", { children: "Copy" })
      ] })
    }
  );
};
export {
  f as CopyPasteButton
};
