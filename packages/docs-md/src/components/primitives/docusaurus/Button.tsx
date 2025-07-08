export function Button({
  style,
  className,
  onClick,
  children,
}: {
  style?: React.CSSProperties;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}
