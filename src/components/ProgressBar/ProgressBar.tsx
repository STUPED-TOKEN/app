import React from "react";
import s from "./ProgressBar.module.css";

export type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  height?: number | string;
  showLabel?: boolean;
  formatLabel?: (value: number, max: number) => string;
  animated?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className, height = 40, showLabel = true, formatLabel = (v, m) => `${v}/${m}`, animated = false }) => {
  const pct = max > 0 ? (100 * clamp(value, 0, max)) / max : 0;

  return (
    <div
      className={`${s.wrapper} ${className ?? ""}`}
      style={{ ["--height" as string]: typeof height === "number" ? `${height}px` : height, ["--progress" as string]: `${pct}%` }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamp(value, 0, max)}>
      <div
        className={s.fill}
        style={{
          width: `${pct}%`,
          transitionDuration: animated ? "240ms" : "0ms",
        }}
      />
      {showLabel ? <div className={s.label}>{formatLabel(clamp(value, 0, max), max)}</div> : <span className={s.srOnly}>{formatLabel(clamp(value, 0, max), max)}</span>}
    </div>
  );
};

export default ProgressBar;
