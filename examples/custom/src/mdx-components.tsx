import type { MDXComponents } from "mdx/types";
import styles from "./mdx-components.module.css";
import { HeadingWrapper } from "./components/mdx";

const components: MDXComponents = {
  h1: (props) => <HeadingWrapper {...props} tag="h1" className={styles.h1} />,
  h2: (props) => <HeadingWrapper {...props} tag="h2" className={styles.h2} />,
  h3: (props) => <HeadingWrapper {...props} tag="h3" className={styles.h3} />,
  h4: (props) => <HeadingWrapper {...props} tag="h4" className={styles.h4} />,
  h5: (props) => <HeadingWrapper {...props} tag="h5" className={styles.h5} />,
  h6: (props) => <HeadingWrapper {...props} tag="h6" className={styles.h6} />,
  p: (props) => <p {...props} className={styles.p} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
