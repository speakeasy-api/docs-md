"use client";

import styles from "../styles.module.css";

type ExpandableCellProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function ExpandableCell({ isOpen, setIsOpen }: ExpandableCellProps) {
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.expandableButtonContainer}>
      <button className={styles.expandableButton} onClick={handleClick}>
        <div
          style={{
            transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.2s ease-in-out",
            transformOrigin: "center",
          }}
        >
          △
        </div>
      </button>
    </div>
  );
}
