'use client';

import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';

type Props = {
  label?: string;
  error?: string;
  labelClassName?: string;
  containerClassName?: string;
} & React.ComponentProps<'input'>;

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, containerClassName, labelClassName, ...rest },
  ref
) {
  return (
    <div className={cn('group', containerClassName)}>
      {label && (
        <label
          className={cn(
            'block text-gray-700 text-sm font-semibold mb-1',
            { 'text-red-500': error },
            { 'group-focus-within:text-accent ': !error },
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        ref={ref}
        className={cn(
          'py-2 px-4 bg-[#EEEEEE] appearance-none w-full group-focus-within:outline-none border border-[#79797959] group-focus-within:border-accent rounded-[18px] placeholder:text-[#797979] text-[#1C1B1F]',
          { 'border-red-500': error },
          className
        )}
      />
      <p
        className={cn(
          'text-xs h-0 overflow-hidden transition-all ml-1 text-red-500',
          {
            'h-auto mt-1': error,
          }
        )}
      >
        {error}
      </p>
    </div>
  );
});

export default Input;
