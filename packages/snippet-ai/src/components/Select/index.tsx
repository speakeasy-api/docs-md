import React, { useId } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps<T extends string> = {
  options: SelectOption[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export const Select = <T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  label,
}: SelectProps<T>) => {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value as T);
  };

  return (
    <div className={clsx('relative inline-flex items-center gap-1', className)}>
      {label && (
        <label htmlFor={`${id}-select`} className="sr-only">
          {label}
        </label>
      )}

      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5 text-neutral-400 dark:text-neutral-500">
        <ChevronDown className="h-3.5 w-3.5" />
      </div>

      <select
        data-testid="snippet-ai:select"
        id={`${id}-select`}
        value={value}
        onChange={handleChange}
        className={clsx(
          'w-fit appearance-none rounded-md border-0 bg-transparent py-1.5 pr-2 pl-6 text-sm',
          'focus:outline-none',
          'focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:ring-offset-1',
          'dark:text-neutral-500 dark:focus-visible:ring-neutral-500',
          {
            'cursor-not-allowed opacity-50': disabled,
          }
        )}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled className="truncate">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
