'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, BookOpen, Dumbbell, Sparkles, Users } from 'lucide-react';
import { Student } from '@/data/students';
import StatRadar from './StatRadar';

interface StudentCardProps {
  student: Student;
  rank: number;
}

const CLASS_COLORS = {
  A: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  C: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  D: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const GRADE_COLORS = {
  'A+': 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
  'A': 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black',
  'B+': 'bg-gradient-to-r from-purple-500 to-purple-400 text-white',
  'B': 'bg-gradient-to-r from-blue-500 to-blue-400 text-white',
  'C+': 'bg-gradient-to-r from-green-500 to-green-400 text-black',
  'C': 'bg-gradient-to-r from-slate-500 to-slate-400 text-white',
  'D': 'bg-gradient-to-r from-red-600 to-red-500 text-white',
};

const STAT_CONFIG = [
  { key: 'academic', label: 'Academic', icon: BookOpen, color: 'text-cyan-400', bgColor: 'bg-cyan-400' },
  { key: 'physical', label: 'Physical', icon: Dumbbell, color: 'text-rose-400', bgColor: 'bg-rose-400' },
  { key: 'adaptability', label: 'Adaptability', icon: Sparkles, color: 'text-purple-400', bgColor: 'bg-purple-400' },
  { key: 'socialContribution', label: 'Social', icon: Users, color: 'text-green-400', bgColor: 'bg-green-400' },
] as const;

export default function StudentCard({ student, rank }: StudentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-slate-800/80 to-slate-900/90
          backdrop-blur-xl border border-slate-700/50
          shadow-lg shadow-black/20
          transition-all duration-300
          ${isExpanded ? 'ring-2 ring-cyan-500/30' : ''}
        `}
      >
        {/* Main Card Content - Clickable */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-4 min-h-[88px] active:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Rank Badge */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-300">#{rank}</span>
            </div>

            {/* Avatar */}
            <div className="relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden border border-slate-600/50">
              <User className="w-7 h-7 text-slate-500" />
              {/* Glow effect based on class */}
              <div className={`absolute inset-0 opacity-20 ${
                student.class === 'A' ? 'bg-amber-500' :
                student.class === 'B' ? 'bg-blue-500' :
                student.class === 'C' ? 'bg-rose-500' : 'bg-slate-500'
              }`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-white truncate">
                  {student.name}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${CLASS_COLORS[student.class]}`}>
                  {student.class}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${GRADE_COLORS[student.grade]}`}>
                  {student.grade}
                </span>
                <span className="text-sm text-slate-400">
                  OAA: <span className="text-white font-semibold">{student.overallScore}</span>
                </span>
              </div>
            </div>

            {/* Expand Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Radar Chart */}
                  <div className="flex-shrink-0">
                    <StatRadar stats={student.stats} size="md" />
                  </div>

                  {/* Stats Breakdown */}
                  <div className="flex-1 w-full space-y-3">
                    {STAT_CONFIG.map(({ key, label, icon: Icon, color, bgColor }) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className="text-xs text-slate-400">{label}</span>
                          </div>
                          <span className={`text-sm font-bold ${color}`}>
                            {student.stats[key]}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.stats[key]}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                            className={`h-full rounded-full ${bgColor}`}
                            style={{ opacity: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 pt-4 border-t border-slate-700/30 grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Overall Score</p>
                    <p className="text-2xl font-bold text-white">{student.overallScore}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Grade</p>
                    <p className={`text-2xl font-bold ${
                      student.grade.startsWith('A') ? 'text-amber-400' :
                      student.grade.startsWith('B') ? 'text-purple-400' :
                      student.grade.startsWith('C') ? 'text-green-400' : 'text-red-400'
                    }`}>{student.grade}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
