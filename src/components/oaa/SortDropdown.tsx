'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, BookOpen, Dumbbell, Sparkles, Users } from 'lucide-react';
import { SortKey } from '@/data/students';

interface SortDropdownProps {
  activeSort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string; icon: typeof TrendingUp }[] = [
  { key: 'overallScore', label: 'Overall Ability', icon: TrendingUp },
  { key: 'academic', label: 'Academic', icon: BookOpen },
  { key: 'physical', label: 'Physical', icon: Dumbbell },
  { key: 'adaptability', label: 'Adaptability', icon: Sparkles },
  { key: 'socialContribution', label: 'Social', icon: Users },
];

export default function SortDropdown({ activeSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = SORT_OPTIONS.find(opt => opt.key === activeSort)!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 min-h-[44px]
          bg-slate-800/50 backdrop-blur-sm rounded-xl
          border border-slate-700/50 text-sm font-medium
          transition-all duration-200
          ${isOpen ? 'border-cyan-500/50 ring-2 ring-cyan-500/20' : ''}
        `}
      >
        <activeOption.icon className="w-4 h-4 text-cyan-400" />
        <span className="text-slate-300">{activeOption.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 z-50
              bg-slate-800/95 backdrop-blur-xl rounded-xl
              border border-slate-700/50 shadow-xl shadow-black/30
              overflow-hidden"
          >
            {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  onSortChange(key);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 min-h-[44px]
                  text-sm text-left transition-colors
                  ${activeSort === key
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-300 active:bg-slate-700/50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${activeSort === key ? 'text-cyan-400' : 'text-slate-500'}`} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
