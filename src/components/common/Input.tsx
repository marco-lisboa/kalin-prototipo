import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-kalin-text">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-kalin-muted">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-xl border bg-white text-kalin-text placeholder:text-gray-400 text-sm py-2.5 transition-all duration-200 outline-none
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightIcon ? 'pr-10' : 'pr-3.5'}
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-kalin-border focus:border-kalin-primary focus:ring-2 focus:ring-kalin-primary/20'
            }
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-kalin-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-kalin-muted">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
