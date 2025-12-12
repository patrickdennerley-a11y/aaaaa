'use client';

import { useState } from 'react';
import { Brain, Loader2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { IntakeEntry, SymptomEntry, DailyStats } from '@/lib/types';

interface AIInsightsProps {
  getLast24Hours: () => {
    intakeEntries: IntakeEntry[];
    symptomEntries: SymptomEntry[];
  };
  todayStats: DailyStats | null;
}

export function AIInsights({ getLast24Hours, todayStats }: AIInsightsProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const logs = getLast24Hours();

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: {
            intake: logs.intakeEntries.map(e => ({
              time: new Date(e.timestamp).toLocaleString(),
              waterMl: e.waterMl,
              tempC: e.temperature,
              sodiumMg: e.sodiumMg,
              potassiumMg: e.potassiumMg,
              electrolyteScoops: e.electrolyteScoops,
              saltTsp: e.saltTsp,
            })),
            symptoms: logs.symptomEntries.map(e => ({
              time: new Date(e.timestamp).toLocaleString(),
              type: e.type,
            })),
          },
          stats: todayStats
            ? {
                totalSodiumMg: todayStats.totalSodiumMg,
                totalPotassiumMg: todayStats.totalPotassiumMg,
                totalFluidMl: todayStats.totalFluidMl,
                intakeCount: todayStats.intakeCount,
              }
            : null,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setInsight(data.insight);
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setError('Failed to connect to AI service. Please check your API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Brain className="w-7 h-7 text-purple-400" />
        AI Analysis
      </h2>

      <p className="text-gray-400 mb-6">
        Get personalized insights based on your last 24 hours of intake and symptoms. The AI will
        analyze correlations and suggest adjustments.
      </p>

      {/* Analyze Button */}
      <button
        onClick={fetchInsights}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-purple-600/30 mb-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Analyzing Your Data...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            Analyze My Last 24 Hours
          </>
        )}
      </button>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/40 border border-red-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Analysis Failed</span>
          </div>
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-red-400/70 text-xs mt-2">
            Make sure you have configured your .env.local file with either ANTHROPIC_API_KEY or
            DEEPSEEK_API_KEY.
          </p>
        </div>
      )}

      {/* Insight Display */}
      {insight && (
        <div className="bg-gray-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Insights
            </h3>
            <button
              onClick={fetchInsights}
              disabled={isLoading}
              className="text-gray-400 hover:text-purple-400 transition-colors p-2"
              aria-label="Refresh analysis"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{insight}</div>
        </div>
      )}

      {/* Setup Instructions */}
      {!insight && !error && !isLoading && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
          <h4 className="text-gray-300 font-semibold mb-3">Setup Required</h4>
          <p className="text-gray-400 text-sm mb-3">
            To use AI analysis, create a <code className="text-cyan-400">.env.local</code> file in
            your project root:
          </p>
          <pre className="bg-gray-950 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
            {`# Choose one: "anthropic" or "deepseek"
LLM_PROVIDER="deepseek"

# API Keys (add the one you're using)
ANTHROPIC_API_KEY="sk-ant-..."
DEEPSEEK_API_KEY="sk-..."`}
          </pre>
          <p className="text-gray-500 text-xs mt-3">
            DeepSeek is recommended for daily use (very cheap). Use Claude for complex symptom
            analysis.
          </p>
        </div>
      )}
    </div>
  );
}
