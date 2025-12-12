'use client';

import { useState, useMemo } from 'react';
import { Droplets, Thermometer, Beaker, Sparkles, AlertTriangle, Plus } from 'lucide-react';
import { calculateTotals } from '@/lib/storage';
import {
  POTASSIUM_WARNING_THRESHOLD,
  TEMP_WARNING_THRESHOLD,
  TEMP_TARGET_MIN,
  TEMP_TARGET_MAX,
} from '@/lib/constants';

interface MixerProps {
  onAddIntake: (
    waterMl: number,
    temperature: number,
    electrolyteScoops: number,
    saltTsp: number
  ) => void;
}

export function Mixer({ onAddIntake }: MixerProps) {
  const [waterMl, setWaterMl] = useState<string>('500');
  const [temperature, setTemperature] = useState<string>('45');
  const [electrolyteScoops, setElectrolyteScoops] = useState<string>('1');
  const [saltTsp, setSaltTsp] = useState<string>('0.5');

  // Calculate totals in real-time
  const calculations = useMemo(() => {
    const water = parseFloat(waterMl) || 0;
    const scoops = parseFloat(electrolyteScoops) || 0;
    const salt = parseFloat(saltTsp) || 0;
    const temp = parseFloat(temperature) || 0;

    const { sodiumMg, potassiumMg } = calculateTotals(scoops, salt);

    // Calculate concentration per liter
    const potassiumPerLiter = water > 0 ? (potassiumMg / water) * 1000 : 0;

    return {
      sodiumMg,
      potassiumMg,
      potassiumPerLiter,
      isPotassiumWarning: potassiumPerLiter > POTASSIUM_WARNING_THRESHOLD,
      isTempWarning: temp > TEMP_WARNING_THRESHOLD,
      isTempInRange: temp >= TEMP_TARGET_MIN && temp <= TEMP_TARGET_MAX,
    };
  }, [waterMl, electrolyteScoops, saltTsp, temperature]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const water = parseFloat(waterMl) || 0;
    const temp = parseFloat(temperature) || 0;
    const scoops = parseFloat(electrolyteScoops) || 0;
    const salt = parseFloat(saltTsp) || 0;

    if (water > 0) {
      onAddIntake(water, temp, scoops, salt);
      // Reset to defaults
      setWaterMl('500');
      setTemperature('45');
      setElectrolyteScoops('1');
      setSaltTsp('0.5');
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Beaker className="w-7 h-7 text-cyan-400" />
        The Mixer
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Water Volume */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 font-medium">
            <Droplets className="w-5 h-5 text-blue-400" />
            Water Volume (ml)
          </label>
          <input
            type="number"
            value={waterMl}
            onChange={e => setWaterMl(e.target.value)}
            className="w-full bg-gray-700 text-white text-lg p-4 rounded-xl border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none transition-all"
            placeholder="500"
            min="0"
            step="50"
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 font-medium">
            <Thermometer className="w-5 h-5 text-orange-400" />
            Temperature (°C)
          </label>
          <input
            type="number"
            value={temperature}
            onChange={e => setTemperature(e.target.value)}
            className="w-full bg-gray-700 text-white text-lg p-4 rounded-xl border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none transition-all"
            placeholder="45"
            min="0"
            max="100"
            step="1"
          />
          {calculations.isTempWarning && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm mt-1">
              <AlertTriangle className="w-4 h-4" />
              Warning: Temperature above 50°C - too hot for rapid drinking!
            </div>
          )}
          {calculations.isTempInRange && !calculations.isTempWarning && (
            <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
              <Sparkles className="w-4 h-4" />
              Perfect! Within target range (45-50°C)
            </div>
          )}
        </div>

        {/* Electrolyte Powder */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 font-medium">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Electrolyte Powder (scoops)
          </label>
          <input
            type="number"
            value={electrolyteScoops}
            onChange={e => setElectrolyteScoops(e.target.value)}
            className="w-full bg-gray-700 text-white text-lg p-4 rounded-xl border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none transition-all"
            placeholder="1"
            min="0"
            step="0.5"
          />
          <p className="text-gray-500 text-sm">200mg Na + 200mg K per scoop</p>
        </div>

        {/* Table Salt */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 font-medium">
            <span className="w-5 h-5 text-white flex items-center justify-center">🧂</span>
            Table Salt (tsp)
          </label>
          <input
            type="number"
            value={saltTsp}
            onChange={e => setSaltTsp(e.target.value)}
            className="w-full bg-gray-700 text-white text-lg p-4 rounded-xl border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none transition-all"
            placeholder="0.5"
            min="0"
            step="0.25"
          />
          <p className="text-gray-500 text-sm">2300mg Na per tsp (pure sodium!)</p>
        </div>

        {/* Real-time Calculation Display */}
        <div className="bg-gray-900 rounded-xl p-5 space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Calculated Totals</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Sodium */}
            <div className="bg-green-900/40 rounded-lg p-4 border border-green-700/50">
              <div className="text-green-400 text-sm font-medium">Sodium</div>
              <div className="text-3xl font-bold text-green-300">
                {calculations.sodiumMg.toLocaleString()}
                <span className="text-lg ml-1">mg</span>
              </div>
              <div className="text-green-500 text-xs mt-1">Vasoconstriction (Good!)</div>
            </div>

            {/* Potassium */}
            <div
              className={`rounded-lg p-4 border ${
                calculations.isPotassiumWarning
                  ? 'bg-red-900/40 border-red-700/50'
                  : 'bg-yellow-900/40 border-yellow-700/50'
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  calculations.isPotassiumWarning ? 'text-red-400' : 'text-yellow-400'
                }`}
              >
                Potassium
              </div>
              <div
                className={`text-3xl font-bold ${
                  calculations.isPotassiumWarning ? 'text-red-300' : 'text-yellow-300'
                }`}
              >
                {calculations.potassiumMg.toLocaleString()}
                <span className="text-lg ml-1">mg</span>
              </div>
              <div
                className={`text-xs mt-1 ${
                  calculations.isPotassiumWarning ? 'text-red-400' : 'text-yellow-500'
                }`}
              >
                {calculations.isPotassiumWarning
                  ? `Warning: ${calculations.potassiumPerLiter.toFixed(0)}mg/L (>${POTASSIUM_WARNING_THRESHOLD})`
                  : 'Vasodilation (Keep low!)'}
              </div>
            </div>
          </div>

          {calculations.isPotassiumWarning && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/30 p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>
                Potassium concentration is &gt;200mg/L - this may cause nausea. Consider adding more
                water or reducing electrolyte scoops.
              </span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-cyan-600/30"
        >
          <Plus className="w-6 h-6" />
          Log This Drink
        </button>
      </form>
    </div>
  );
}
