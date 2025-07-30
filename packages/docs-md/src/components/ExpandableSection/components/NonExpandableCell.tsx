import styles from "../styles.module.css";

export function NonExpandableCell() {
  return (
    <div className={styles.nonExpandableCell}>
      <div className={styles.nonExpandableCellContent}>·</div>
    </div>
  );
}
