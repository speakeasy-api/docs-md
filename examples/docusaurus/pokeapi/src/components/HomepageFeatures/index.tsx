import type { ReactNode } from "react";
import styles from "./styles.module.css";

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">We have some cool features</div>
      </div>
    </section>
  );
}
