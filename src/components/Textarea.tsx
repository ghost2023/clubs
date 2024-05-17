'use client';

import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';

type Props = {
  label?: string;
  error?: string;
  labelClassName?: string;
  containerClassName?: string;
} & React.ComponentProps<'textarea'>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Input(
  { label, error, className, containerClassName, labelClassName, ...rest },
  ref
) {
  return (
    <div className={cn('group', containerClassName)}>
      {label && (
        <label
          className={cn(
            'block text-gray-700 group-focus-within:text-accent text-sm font-semibold mb-1',
            { 'text-red-500': !!error },
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <textarea
        {...rest}
        ref={ref}
        className={cn(
          'py-2 px-3 shadow appearance-none w-full group-focus-within:outline-none  border border-[#79797959] group-focus-within:border-accent rounded-[18px] bg-[#EEEEEE] text-gray-800',
          { 'border-red-500': error },
          className
        )}
      />
      {error ? <p className="text-xs text-red-500 mt-2">{error}</p> : null}
    </div>
  );
});

export default Textarea;
