import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  variant?: 'default' | 'dark' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-kalin-border text-kalin-text shadow-kalin-sm',
    dark: 'bg-kalin-darkcard border border-kalin-darkborder text-white shadow-kalin-md',
    glass: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-kalin-md text-kalin-text'
  };

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:shadow-kalin-lg hover:-translate-y-1 hover:border-kalin-primary/40'
    : '';

  return (
    <div
      className={`rounded-2xl p-5 ${variantStyles[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
