export function Button({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
