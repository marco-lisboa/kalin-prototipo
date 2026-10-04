import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  colorVariant?: 'primary' | 'green' | 'dark';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showLabel = false,
  colorVariant = 'primary',
  className = ''
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const gradientStyles = {
    primary: 'bg-gradient-to-r from-kalin-green to-kalin-primary',
    green: 'bg-kalin-green',
    dark: 'bg-kalin-dark'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-kalin-text">
          <span>Progresso</span>
          <span className="text-kalin-green">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-kalin-light rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${gradientStyles[colorVariant]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
