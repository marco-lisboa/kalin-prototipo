import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = ''
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-kalin-muted absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-white border border-kalin-border rounded-xl text-sm text-kalin-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-kalin-primary/20 focus:border-kalin-primary transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
