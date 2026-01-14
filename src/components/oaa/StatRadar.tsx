'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { StudentStats } from '@/data/students';

interface StatRadarProps {
  stats: StudentStats;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  animated?: boolean;
}

const STAT_COLORS = {
  academic: '#22d3ee',     // Neon Cyan
  physical: '#f43f5e',     // Neon Red
  adaptability: '#a855f7', // Neon Purple
  socialContribution: '#22c55e', // Neon Green
};

const STAT_LABELS = {
  academic: 'Academic',
  physical: 'Physical',
  adaptability: 'Adapt',
  socialContribution: 'Social',
};

export default function StatRadar({
  stats,
  size = 'md',
  showLabels = true,
  animated = true
}: StatRadarProps) {
  const data = [
    {
      stat: STAT_LABELS.academic,
      value: stats.academic,
      fullMark: 100,
      color: STAT_COLORS.academic
    },
    {
      stat: STAT_LABELS.physical,
      value: stats.physical,
      fullMark: 100,
      color: STAT_COLORS.physical
    },
    {
      stat: STAT_LABELS.adaptability,
      value: stats.adaptability,
      fullMark: 100,
      color: STAT_COLORS.adaptability
    },
    {
      stat: STAT_LABELS.socialContribution,
      value: stats.socialContribution,
      fullMark: 100,
      color: STAT_COLORS.socialContribution
    },
  ];

  const sizeConfig = {
    sm: { width: 120, height: 120, fontSize: 8, outerRadius: 40 },
    md: { width: 200, height: 200, fontSize: 10, outerRadius: 70 },
    lg: { width: 300, height: 300, fontSize: 12, outerRadius: 110 },
  };

  const config = sizeConfig[size];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { stat: string; value: number } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-slate-400">{item.stat}</p>
          <p className="text-sm font-bold text-white">{item.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: config.width, height: config.height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius={config.outerRadius}>
          <PolarGrid
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth={0.5}
          />
          <PolarAngleAxis
            dataKey="stat"
            tick={showLabels ? {
              fill: '#94a3b8',
              fontSize: config.fontSize,
              fontWeight: 500
            } : false}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="url(#radarGradient)"
            fill="url(#radarFillGradient)"
            fillOpacity={0.4}
            strokeWidth={2}
            isAnimationActive={animated}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={STAT_COLORS.academic} />
              <stop offset="33%" stopColor={STAT_COLORS.physical} />
              <stop offset="66%" stopColor={STAT_COLORS.adaptability} />
              <stop offset="100%" stopColor={STAT_COLORS.socialContribution} />
            </linearGradient>
            <linearGradient id="radarFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={STAT_COLORS.academic} stopOpacity={0.8} />
              <stop offset="33%" stopColor={STAT_COLORS.physical} stopOpacity={0.6} />
              <stop offset="66%" stopColor={STAT_COLORS.adaptability} stopOpacity={0.6} />
              <stop offset="100%" stopColor={STAT_COLORS.socialContribution} stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
