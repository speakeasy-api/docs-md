import type { MDXComponents } from "mdx/types";
import styles from "./mdx-components.module.css";
import { HeadingWrapper } from "./mdx";

export const components: MDXComponents = {
  h1: ({ style, ...props }) => (
    <HeadingWrapper {...props} tag="h1" className={styles.h1} />
  ),
  h2: ({ style, ...props }) => (
    <HeadingWrapper {...props} tag="h2" className={styles.h2} />
  ),
  h3: ({ style, ...props }) => (
    <HeadingWrapper {...props} tag="h3" className={styles.h3} />
  ),
  h4: ({ style, ...props }) => (
    <HeadingWrapper {...props} tag="h4" className={styles.h4} />
  ),
  h5: ({ style, ...props }) => (
    <HeadingWrapper {...props} tag="h5" className={styles.h5} />
  ),
  h6: ({ style, ...props }) => (
    <HeadingWrapper {...props} tag="h6" className={styles.h6} />
  ),
  p: ({ style, ...props }) => <p {...props} className={styles.p} />,
  strong: ({ style, ...props }) => (
    <strong {...props} className={styles.strong} />
  ),
  em: ({ style, ...props }) => <em {...props} className={styles.em} />,
  pre: ({ style, ...props }) => <pre {...props} className={styles.pre} />,
  code: ({ style, ...props }) => <code {...props} className={styles.code} />,
  a: ({ style, ...props }) => <a {...props} className={styles.a} />,
  blockquote: ({ style, ...props }) => (
    <blockquote {...props} className={styles.blockquote} />
  ),
  br: ({ style, ...props }) => <br {...props} className={styles.br} />,
  hr: ({ style, ...props }) => <hr {...props} className={styles.hr} />,
  img: ({ style, ...props }) => <img {...props} className={styles.img} />,
  ul: ({ style, ...props }) => <ul {...props} className={styles.ul} />,
  ol: ({ style, ...props }) => <ol {...props} className={styles.ol} />,
  li: ({ style, ...props }) => <li {...props} className={styles.li} />,
};
