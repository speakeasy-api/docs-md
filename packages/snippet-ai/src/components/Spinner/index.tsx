import clsx from 'clsx';
import spinnerStyles from './styles/spinner.css?inline';

export interface SpinnerProps {
  size?: number | string;
  isLoading?: boolean;
  className?: string;
}

export const Spinner = ({ size, isLoading, className }: SpinnerProps) => {
  return (
    <>
      <style type="text/css">{spinnerStyles}</style>
      <div
        className={clsx(
          'size-5',
          {
            'SpinnerComponent-Visible': isLoading,
            'SpinnerComponent-Hidden': !isLoading,
          },
          'flex-shrink-0 flex-grow-0 justify-self-stretch rounded-full border-2 border-solid border-neutral-300 border-t-neutral-900 opacity-0',
          'dark:border-neutral-700 dark:border-t-neutral-200',
          className
        )}
        style={{ width: size, height: size }}
      />
    </>
  );
};
