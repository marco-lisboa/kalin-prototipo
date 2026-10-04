import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-kalin-border bg-white/50 ${className}`}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-kalin-light text-kalin-primary flex items-center justify-center mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-kalin-dark mb-1">{title}</h3>
      <p className="text-sm text-kalin-muted max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
