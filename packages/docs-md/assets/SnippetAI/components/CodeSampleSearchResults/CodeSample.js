import { jsx as p } from "react/jsx-runtime";
import { Light as r } from "react-syntax-highlighter";
import m from "react-syntax-highlighter/dist/esm/languages/hljs/typescript.js";
import g from "react-syntax-highlighter/dist/esm/languages/hljs/python.js";
import i from "react-syntax-highlighter/dist/esm/languages/hljs/go.js";
import s from "react-syntax-highlighter/dist/esm/languages/hljs/java.js";
import n from "react-syntax-highlighter/dist/esm/languages/hljs/csharp.js";
import d from "react-syntax-highlighter/dist/esm/languages/hljs/php.js";
r.registerLanguage("typescript", m);
r.registerLanguage("python", g);
r.registerLanguage("go", i);
r.registerLanguage("java", s);
r.registerLanguage("csharp", n);
r.registerLanguage("php", d);
const j = ({
  language: e,
  code: t,
  className: o,
  codeTheme: a
}) => /* @__PURE__ */ p(
  r,
  {
    "data-testid": "code-words:code-sample",
    showLineNumbers: !0,
    language: e,
    style: a,
    customStyle: {
      borderRadius: ".5rem",
      margin: "0 8px",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      maxHeight: "50vh"
    },
    className: o,
    children: t
  }
);
export {
  j as CodeSample
};
