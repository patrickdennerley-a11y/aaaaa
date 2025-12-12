'use client';

import { Snowflake, Frown, Cloud, Smile, Activity, X, Clock } from 'lucide-react';
import { SYMPTOM_TYPES, SymptomType } from '@/lib/constants';
import { SymptomEntry } from '@/lib/types';

interface SymptomLoggerProps {
  onLogSymptom: (type: SymptomType) => void;
  recentSymptoms: SymptomEntry[];
  onDeleteSymptom?: (id: string) => void;
}

const iconMap = {
  Snowflake,
  Frown,
  Cloud,
  Smile,
};

export function SymptomLogger({
  onLogSymptom,
  recentSymptoms,
  onDeleteSymptom,
}: SymptomLoggerProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getSymptomInfo = (type: string) => {
    return SYMPTOM_TYPES.find(s => s.id === type);
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Activity className="w-7 h-7 text-pink-400" />
        How Are You Feeling?
      </h2>

      {/* Symptom Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {SYMPTOM_TYPES.map(symptom => {
          const Icon = iconMap[symptom.icon as keyof typeof iconMap];
          return (
            <button
              key={symptom.id}
              onClick={() => onLogSymptom(symptom.id)}
              className={`${symptom.color} hover:opacity-90 text-white font-bold py-5 px-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 active:scale-95 shadow-lg min-h-[100px]`}
            >
              <Icon className="w-8 h-8" />
              <span className="text-sm">{symptom.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recent Symptoms */}
      {recentSymptoms.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Logs Today
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentSymptoms
              .slice()
              .reverse()
              .slice(0, 5)
              .map(entry => {
                const symptomInfo = getSymptomInfo(entry.type);
                const Icon = symptomInfo
                  ? iconMap[symptomInfo.icon as keyof typeof iconMap]
                  : null;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5 text-gray-300" />}
                      <span className="text-gray-200">{symptomInfo?.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{formatTime(entry.timestamp)}</span>
                      {onDeleteSymptom && (
                        <button
                          onClick={() => onDeleteSymptom(entry.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          aria-label="Delete symptom log"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
