'use client';

import { useState } from 'react';
import {
  Beaker,
  Activity,
  LayoutDashboard,
  Brain,
  Heart,
  Droplets,
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { Mixer } from '@/components/Mixer';
import { SymptomLogger } from '@/components/SymptomLogger';
import { Dashboard } from '@/components/Dashboard';
import { AIInsights } from '@/components/AIInsights';
import { SymptomType } from '@/lib/constants';

type TabType = 'mixer' | 'symptoms' | 'dashboard' | 'ai';

const tabs = [
  { id: 'mixer' as TabType, label: 'Mixer', icon: Beaker },
  { id: 'symptoms' as TabType, label: 'Symptoms', icon: Activity },
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ai' as TabType, label: 'AI Insights', icon: Brain },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('mixer');

  const {
    symptomEntries,
    todayStats,
    weeklyStats,
    isLoaded,
    addIntakeEntry,
    addSymptomEntry,
    removeSymptomEntry,
    getLast24Hours,
  } = useAppData();

  // Filter today's symptoms
  const todayString = new Date().toISOString().split('T')[0];
  const todaySymptoms = symptomEntries.filter(
    e => new Date(e.timestamp).toISOString().split('T')[0] === todayString
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3 text-cyan-400">
          <Droplets className="w-8 h-8" />
          <span className="text-xl font-medium">Loading Dysauto-Dash...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-24">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-xl">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dysauto-Dash</h1>
                <p className="text-xs text-gray-400">Hydration Tracker for POTS</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Stay hydrated</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'mixer' && (
          <Mixer
            onAddIntake={(water, temp, scoops, salt) =>
              addIntakeEntry(water, temp, scoops, salt)
            }
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomLogger
            onLogSymptom={(type: SymptomType) => addSymptomEntry(type)}
            recentSymptoms={todaySymptoms}
            onDeleteSymptom={removeSymptomEntry}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard todayStats={todayStats} weeklyStats={weeklyStats} />
        )}

        {activeTab === 'ai' && (
          <AIInsights getLast24Hours={getLast24Hours} todayStats={todayStats} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 safe-bottom">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex justify-around">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-3 px-4 min-w-[70px] transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-1 ${
                      isActive ? 'scale-110' : ''
                    } transition-transform`}
                  />
                  <span className="text-xs font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 w-12 h-1 bg-cyan-400 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
