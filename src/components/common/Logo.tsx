import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  to?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  to = '/app',
  className = ''
}) => {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', sub: 'text-xs' }
  };

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon */}

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline leading-none">
          <span
            className={`font-black tracking-tight ${sizeClasses[size].text} ${isLight ? 'text-white' : 'text-kalin-dark'
              }`}
          >
            KALIN
          </span>
          <span className={`font-extrabold ml-1 ${sizeClasses[size].text} text-kalin-primary`}>
            EDUC
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-wider uppercase mt-0.5 ${sizeClasses[size].sub} ${isLight ? 'text-kalin-light/70' : 'text-kalin-muted'
              }`}
          >
            Grupo Kalin
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};
