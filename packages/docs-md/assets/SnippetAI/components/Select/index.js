import { jsxs as s, jsx as t } from "react/jsx-runtime";
import { useId as p } from "react";
import i from "clsx";
import { ChevronDown as f } from "lucide-react";
const b = ({
  options: o,
  value: c,
  onChange: u,
  placeholder: n = "Select an option",
  disabled: l = !1,
  className: d = "",
  label: r
}) => {
  const a = p(), m = (e) => {
    u?.(e.target.value);
  };
  return /* @__PURE__ */ s("div", { className: i("relative inline-flex gap-1 items-center", d), children: [
    r && /* @__PURE__ */ t("label", { htmlFor: `${a}-select`, className: "sr-only", children: r }),
    /* @__PURE__ */ t("div", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5 text-neutral-400 dark:text-neutral-500", children: /* @__PURE__ */ t(f, { className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ s(
      "select",
      {
        "data-testid": "snippet-ai:select",
        id: `${a}-select`,
        value: c,
        onChange: m,
        className: i(
          "w-fit appearance-none rounded-md border-0 bg-transparent pl-6 pr-2 py-1.5 text-sm",
          "focus:outline-none",
          "focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:ring-offset-1",
          "dark:focus-visible:ring-neutral-500 dark:text-neutral-500",
          {
            "cursor-not-allowed opacity-50": l
          }
        ),
        disabled: l,
        children: [
          n && /* @__PURE__ */ t("option", { value: "", disabled: !0, className: "truncate", children: n }),
          o.map((e) => /* @__PURE__ */ t(
            "option",
            {
              value: e.value,
              children: e.label
            },
            e.value
          ))
        ]
      }
    )
  ] });
};
export {
  b as Select
};
