import clsx from "clsx";
import type React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "small" | "medium" | "large";
}
const Button: React.FC<ButtonProps> = (props) => {
  const { children, onClick, className } = props;
  const buttonClassname = clsx(className, styles.button, {
    [styles.small]: props.size === "small",
    [styles.medium]: props.size === "medium",
    [styles.large]: props.size === "large",
  });
  return (
    <button
      onClick={onClick}
      className={buttonClassname}>
      <span>{children}</span>
    </button>
  );
};

export default Button;
