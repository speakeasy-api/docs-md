import clsx from "clsx";

import type { TypeInfo } from "../../../renderers/base/base.ts";
import type { PropertyProps } from "../common/types.ts";
import styles from "./styles.module.css";

function TypeSegment({ typeInfo }: { typeInfo: TypeInfo }) {
  switch (typeInfo.label) {
    case "array":
    case "map":
    case "set": {
      return (
        <span className={styles.typeSegment}>
          <span>{typeInfo.label}&lt;</span>
          <span>
            {typeInfo.children.map((childTypeInfo, i) => (
              <span
                key={i}
                className={clsx(styles.typeSegment, styles.unionSegment)}
              >
                <TypeSegment typeInfo={childTypeInfo} />
              </span>
            ))}
          </span>
          <span>&gt;</span>
        </span>
      );
    }
    case "union":
    case "enum": {
      return (
        <span className={styles.typeSegment}>
          {typeInfo.children.map((childTypeInfo, i) => (
            <span
              key={i}
              className={clsx(styles.typeSegment, styles.unionSegment)}
            >
              <TypeSegment typeInfo={childTypeInfo} />
            </span>
          ))}
        </span>
      );
    }
    default: {
      return (
        <span
          className={styles.typeSegment}
          dangerouslySetInnerHTML={{ __html: typeInfo.linkedLabel }}
        />
      );
    }
  }
}

export function DocusaurusProperty({ children, typeInfo }: PropertyProps) {
  return (
    <div className={styles.container}>
      <div>{children}</div>
      <div>
        <TypeSegment typeInfo={typeInfo} />
      </div>
    </div>
  );
}
