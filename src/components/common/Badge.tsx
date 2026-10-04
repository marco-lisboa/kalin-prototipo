import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'neutral' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  const variantStyles = {
    primary: 'bg-kalin-light text-kalin-green border border-kalin-primary/30 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium',
    info: 'bg-blue-50 text-blue-700 border border-blue-200 font-medium',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200 font-medium',
    dark: 'bg-kalin-dark text-white border border-kalin-darkcard font-medium'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
