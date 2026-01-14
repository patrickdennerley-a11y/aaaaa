'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search students...' }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-slate-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-12 pl-12 pr-12
          bg-slate-800/50 backdrop-blur-sm
          border border-slate-700/50 rounded-xl
          text-white placeholder-slate-500
          text-base font-medium
          transition-all duration-200
          focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center min-h-[44px]"
        >
          <X className="w-5 h-5 text-slate-500 active:text-slate-300" />
        </button>
      )}
    </div>
  );
}
