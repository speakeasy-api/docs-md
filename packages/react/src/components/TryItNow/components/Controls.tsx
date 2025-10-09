import { useChildren } from "../../../util/hooks.ts";
import styles from "./styles.module.css";

export function Controls({ children }: { children: React.ReactNode }) {
  const copyButtonChild = useChildren(children, "copyButton");
  const resetButtonChild = useChildren(children, "resetButton");
  const runButtonChild = useChildren(children, "runButton");
  return (
    <div className={styles.controls}>
      <div className={styles.leftControls}>
        {copyButtonChild}
        {resetButtonChild}
      </div>
      {runButtonChild}
    </div>
  );
}
