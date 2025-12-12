'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Droplets, Zap, FlaskConical } from 'lucide-react';
import { DailyStats } from '@/lib/types';

interface DashboardProps {
  todayStats: DailyStats | null;
  weeklyStats: DailyStats[];
}

export function Dashboard({ todayStats, weeklyStats }: DashboardProps) {
  // Format date for chart labels
  const formatChartData = (stats: DailyStats[]) => {
    return stats.map(day => {
      const date = new Date(day.date);
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sodium: day.totalSodiumMg,
        potassium: day.totalPotassiumMg,
        fluid: day.totalFluidMl,
      };
    });
  };

  const chartData = formatChartData(weeklyStats);

  // Calculate 7-day averages
  const avgSodium =
    weeklyStats.length > 0
      ? Math.round(weeklyStats.reduce((sum, d) => sum + d.totalSodiumMg, 0) / weeklyStats.length)
      : 0;

  const avgPotassium =
    weeklyStats.length > 0
      ? Math.round(weeklyStats.reduce((sum, d) => sum + d.totalPotassiumMg, 0) / weeklyStats.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Today's Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sodium Card */}
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-6 shadow-xl border border-green-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-300 text-sm font-medium">Today&apos;s Sodium</span>
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-green-100">
            {(todayStats?.totalSodiumMg || 0).toLocaleString()}
            <span className="text-lg text-green-300 ml-1">mg</span>
          </div>
          <div className="text-green-400 text-sm mt-2">
            7-day avg: {avgSodium.toLocaleString()} mg
          </div>
        </div>

        {/* Potassium Card */}
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-2xl p-6 shadow-xl border border-yellow-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-300 text-sm font-medium">Today&apos;s Potassium</span>
            <FlaskConical className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-4xl font-bold text-yellow-100">
            {(todayStats?.totalPotassiumMg || 0).toLocaleString()}
            <span className="text-lg text-yellow-300 ml-1">mg</span>
          </div>
          <div className="text-yellow-400 text-sm mt-2">
            7-day avg: {avgPotassium.toLocaleString()} mg
          </div>
        </div>

        {/* Fluid Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 shadow-xl border border-blue-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 text-sm font-medium">Today&apos;s Fluid</span>
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-blue-100">
            {((todayStats?.totalFluidMl || 0) / 1000).toFixed(1)}
            <span className="text-lg text-blue-300 ml-1">L</span>
          </div>
          <div className="text-blue-400 text-sm mt-2">
            {todayStats?.intakeCount || 0} drink{(todayStats?.intakeCount || 0) !== 1 ? 's' : ''}{' '}
            logged
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          7-Day Intake Trend
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value: number, name: string) => {
                  if (name === 'sodium') return [`${value.toLocaleString()} mg`, 'Sodium'];
                  if (name === 'potassium') return [`${value.toLocaleString()} mg`, 'Potassium'];
                  return [`${value} ml`, 'Fluid'];
                }}
              />
              <Legend
                formatter={(value: string) => {
                  if (value === 'sodium') return 'Sodium (mg)';
                  if (value === 'potassium') return 'Potassium (mg)';
                  return 'Fluid (ml)';
                }}
              />
              <Bar dataKey="sodium" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="potassium" fill="#EAB308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
