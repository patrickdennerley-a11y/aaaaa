'use client';

import { motion } from 'framer-motion';
import { ClassFilter as ClassFilterType } from '@/data/students';

interface ClassFilterProps {
  activeFilter: ClassFilterType;
  onFilterChange: (filter: ClassFilterType) => void;
}

const FILTERS: { key: ClassFilterType; label: string; color: string }[] = [
  { key: 'All', label: 'All', color: 'bg-slate-500' },
  { key: 'A', label: 'A', color: 'bg-amber-500' },
  { key: 'B', label: 'B', color: 'bg-blue-500' },
  { key: 'C', label: 'C', color: 'bg-rose-500' },
  { key: 'D', label: 'D', color: 'bg-slate-400' },
];

export default function ClassFilter({ activeFilter, onFilterChange }: ClassFilterProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
      {FILTERS.map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`
            relative px-4 py-2.5 min-h-[44px] rounded-lg font-medium text-sm
            transition-colors duration-200
            ${activeFilter === key ? 'text-white' : 'text-slate-400'}
          `}
        >
          {activeFilter === key && (
            <motion.div
              layoutId="activeFilter"
              className={`absolute inset-0 ${color} rounded-lg`}
              style={{ opacity: 0.3 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {key !== 'All' && (
              <span className={`w-2 h-2 rounded-full ${color}`} />
            )}
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
