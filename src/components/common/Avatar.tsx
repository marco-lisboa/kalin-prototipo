import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg font-bold',
    xl: 'w-20 h-20 text-2xl font-bold'
  };

  const getInitials = (n: string) => {
    if (!n) return 'K';
    const parts = n.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        className={`rounded-full object-cover border border-kalin-border shadow-sm ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-kalin-dark text-kalin-primary border border-kalin-primary/30 flex items-center justify-center font-semibold select-none shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
