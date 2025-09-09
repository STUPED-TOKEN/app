import type React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose, title, children } = props;

  if (!isOpen) return null;

  return (
    <div
      className={styles.wrapper}
      onClick={onClose}>
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}>
        <p className={styles.title}>{title}</p>
        <div>{children}</div>
      </div>
    </div>
  );
};
