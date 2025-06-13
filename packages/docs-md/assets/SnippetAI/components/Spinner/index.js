import { jsxs as o, Fragment as l, jsx as t } from "react/jsx-runtime";
import s from "clsx";
import i from "./styles/spinner.css.js";
const a = ({ size: r, isLoading: e, className: n }) => /* @__PURE__ */ o(l, { children: [
  /* @__PURE__ */ t("style", { type: "text/css", children: i }),
  /* @__PURE__ */ t(
    "div",
    {
      className: s(
        "size-5",
        {
          "SpinnerComponent-Visible": e,
          "SpinnerComponent-Hidden": !e
        },
        "flex-shrink-0 flex-grow-0 justify-self-stretch rounded-full border-2 border-solid border-neutral-300 border-t-neutral-900 opacity-0",
        "dark:border-neutral-700 dark:border-t-neutral-200",
        n
      ),
      style: { width: r, height: r }
    }
  )
] });
export {
  a as Spinner
};
