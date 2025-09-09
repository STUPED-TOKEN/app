interface RedXProps {
  className?: string;
}

export const RedX = (props: RedXProps) => {
  const { className } = props;
  return (
    <svg
      width="319"
      height="144"
      viewBox="0 0 319 144"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.21243 11.0547C74.8849 35.8886 142.557 60.7226 189.37 77.2409C236.183 93.7593 260.086 101.209 273.486 105.047C286.886 108.885 289.059 108.885 291.298 108.885"
        stroke="#D42828"
        stroke-width="14"
        stroke-linecap="round"
      />
      <path
        d="M311.052 7.29199C309.81 7.29199 308.569 7.29199 273.317 21.2611C238.065 35.2302 168.84 63.1684 126.97 81.7515C85.1007 100.335 72.6838 108.716 63.6485 114.431C54.6133 120.145 49.3361 122.939 44.9102 125.62C40.4843 128.301 37.0696 130.784 33.5515 136.165"
        stroke="#D42828"
        stroke-width="14"
        stroke-linecap="round"
      />
    </svg>
  );
};
