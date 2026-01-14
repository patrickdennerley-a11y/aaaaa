'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Trophy, Users as UsersIcon } from 'lucide-react';
import {
  students,
  sortStudents,
  filterByClass,
  searchStudents,
  SortKey,
  ClassFilter as ClassFilterType,
} from '@/data/students';
import StudentCard from '@/components/oaa/StudentCard';
import ClassFilter from '@/components/oaa/ClassFilter';
import SortDropdown from '@/components/oaa/SortDropdown';
import SearchBar from '@/components/oaa/SearchBar';

export default function OAAPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<ClassFilterType>('All');
  const [sortKey, setSortKey] = useState<SortKey>('overallScore');

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // Apply search
    if (searchQuery) {
      result = searchStudents(result, searchQuery);
    }

    // Apply class filter
    result = filterByClass(result, classFilter);

    // Apply sorting
    result = sortStudents(result, sortKey);

    return result;
  }, [searchQuery, classFilter, sortKey]);

  const totalStudents = students.length;
  const filteredCount = filteredAndSortedStudents.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">OAA System</h1>
              <p className="text-sm text-slate-500">Over All Ability Rankings</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 mt-4 px-4 py-3 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-400">
                Showing <span className="text-white font-semibold">{filteredCount}</span> of <span className="text-white font-semibold">{totalStudents}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
            <ClassFilter activeFilter={classFilter} onFilterChange={setClassFilter} />
          </div>
          <SortDropdown activeSort={sortKey} onSortChange={setSortKey} />
        </div>

        {/* Student List */}
        <LayoutGroup>
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    layout: { type: 'spring', bounce: 0.2, duration: 0.6 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                >
                  <StudentCard student={student} rank={index + 1} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Empty State */}
        {filteredAndSortedStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <UsersIcon className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 text-center">No students found</p>
            <p className="text-slate-500 text-sm text-center mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-6" />
    </div>
  );
}
