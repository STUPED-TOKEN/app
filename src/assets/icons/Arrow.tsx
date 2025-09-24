interface ArrowProps {
  className?: string;
}
export const Arrow = (props: ArrowProps) => {
  const { className } = props;
  return (
    <svg
      width="65"
      height="30"
      viewBox="0 0 65 30"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 12.5C1.61929 12.5 0.5 13.6193 0.5 15C0.5 16.3807 1.61929 17.5 3 17.5L3 15L3 12.5ZM65 15L40 0.566246L40 29.4338L65 15ZM3 15L3 17.5L42.5 17.5L42.5 15L42.5 12.5L3 12.5L3 15Z"
        fill="white"
      />
    </svg>
  );
};
