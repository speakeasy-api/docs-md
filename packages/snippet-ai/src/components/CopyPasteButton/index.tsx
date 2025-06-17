import { useCallback, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export type CopyPasteButtonProps = {
  textToCopy: string;
  className?: string;
};

export const CopyPasteButton = ({
  textToCopy,
  className,
}: CopyPasteButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        // Reset the copied state after 3 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        'flex cursor-pointer items-center gap-2 rounded-md bg-neutral-200 p-2 text-neutral-800 transition-colors hover:bg-neutral-300',
        'dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600',
        className
      )}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={16} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};
