export function ChevronIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 20"
      strokeWidth="1.5"
      stroke="currentColor"
      width="100%"
      height="100%"
      className={className}
      style={style}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 6.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
