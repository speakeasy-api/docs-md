export function Button({
  style,
  onClick,
  className,
  children,
}: {
  style?: React.CSSProperties;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}
