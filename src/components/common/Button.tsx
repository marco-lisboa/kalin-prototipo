import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-kalin-primary text-white hover:bg-kalin-green focus:ring-kalin-primary shadow-sm hover:shadow-kalin-glow/30',
    secondary: 'bg-kalin-light text-kalin-dark hover:bg-kalin-primary/20 focus:ring-kalin-primary',
    outline: 'border border-kalin-border text-kalin-text hover:bg-kalin-light/60 hover:border-kalin-primary focus:ring-kalin-primary',
    ghost: 'text-kalin-text hover:bg-kalin-light/70 focus:ring-kalin-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    dark: 'bg-kalin-dark text-white hover:bg-[#12241D] focus:ring-kalin-dark border border-kalin-darkcard'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
