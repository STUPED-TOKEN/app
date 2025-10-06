import clsx from "clsx";
import type React from "react";
import styles from "./Counter.module.css";
import { useState } from "react";

interface CounterProps {
  className?: string;
  size?: "small" | "medium" | "large";
  onCountChange?: (count: number) => void;
}
export const Counter: React.FC<CounterProps> = (props) => {
  const [count, setCount] = useState(0);

  const handlePlusClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    props.onCountChange?.(newCount);
  };

  const handleMinusClick = () => {
    const newCount = count - 1 < 0 ? 0 : count - 1;
    setCount(newCount);
    props.onCountChange?.(newCount);
  };

  const { className } = props;
  const counterClassname = clsx(className, styles.button, {
    [styles.small]: props.size === "small",
    [styles.medium]: props.size === "medium",
    [styles.large]: props.size === "large",
  });

  return (
    <div className={counterClassname}>
      <span onClick={handleMinusClick}>-</span>
      <div className={styles.count}>{count}</div>
      <span onClick={handlePlusClick}>+</span>
    </div>
  );
};
