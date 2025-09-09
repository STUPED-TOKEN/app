interface ArrowProps {
  className?: string;
}
export const Arrow = (props: ArrowProps) => {
  const { className } = props;
  return (
    <svg
      width="119"
      height="30"
      viewBox="0 0 119 30"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 12.5C1.61929 12.5 0.5 13.6193 0.5 15C0.5 16.3807 1.61929 17.5 3 17.5V15V12.5ZM118.5 15L93.5 0.566243V29.4338L118.5 15ZM3 15V17.5H96V15V12.5H3V15Z"
        fill="white"
      />
    </svg>
  );
};
