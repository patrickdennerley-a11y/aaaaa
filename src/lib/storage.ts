import { AppData, IntakeEntry, SymptomEntry, DailyStats } from './types';
import { ELECTROLYTE_SCOOP, TABLE_SALT_TSP } from './constants';

const STORAGE_KEY = 'dysauto-dash-data';

// Initialize empty app data
const getEmptyData = (): AppData => ({
  intakeEntries: [],
  symptomEntries: [],
});

// Load data from localStorage
export const loadData = (): AppData => {
  if (typeof window === 'undefined') return getEmptyData();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getEmptyData();
    return JSON.parse(stored) as AppData;
  } catch {
    return getEmptyData();
  }
};

// Save data to localStorage
export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Calculate electrolyte totals
export const calculateTotals = (
  electrolyteScoops: number,
  saltTsp: number
): { sodiumMg: number; potassiumMg: number } => {
  const sodiumMg =
    electrolyteScoops * ELECTROLYTE_SCOOP.sodium +
    saltTsp * TABLE_SALT_TSP.sodium;
  const potassiumMg = electrolyteScoops * ELECTROLYTE_SCOOP.potassium;

  return { sodiumMg, potassiumMg };
};

// Add intake entry
export const addIntakeEntry = (
  waterMl: number,
  temperature: number,
  electrolyteScoops: number,
  saltTsp: number
): IntakeEntry => {
  const data = loadData();
  const { sodiumMg, potassiumMg } = calculateTotals(electrolyteScoops, saltTsp);

  const entry: IntakeEntry = {
    id: generateId(),
    timestamp: Date.now(),
    waterMl,
    temperature,
    electrolyteScoops,
    saltTsp,
    sodiumMg,
    potassiumMg,
  };

  data.intakeEntries.push(entry);
  saveData(data);

  return entry;
};

// Add symptom entry
export const addSymptomEntry = (type: string): SymptomEntry => {
  const data = loadData();

  const entry: SymptomEntry = {
    id: generateId(),
    timestamp: Date.now(),
    type: type as SymptomEntry['type'],
  };

  data.symptomEntries.push(entry);
  saveData(data);

  return entry;
};

// Get today's date string
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get date string from timestamp
export const getDateString = (timestamp: number): string => {
  return new Date(timestamp).toISOString().split('T')[0];
};

// Get daily stats for a specific date
export const getDailyStats = (date: string): DailyStats => {
  const data = loadData();

  const dayEntries = data.intakeEntries.filter(
    entry => getDateString(entry.timestamp) === date
  );

  return {
    date,
    totalSodiumMg: dayEntries.reduce((sum, e) => sum + e.sodiumMg, 0),
    totalPotassiumMg: dayEntries.reduce((sum, e) => sum + e.potassiumMg, 0),
    totalFluidMl: dayEntries.reduce((sum, e) => sum + e.waterMl, 0),
    intakeCount: dayEntries.length,
  };
};

// Get stats for last N days
export const getWeeklyStats = (days: number = 7): DailyStats[] => {
  const stats: DailyStats[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    stats.push(getDailyStats(dateString));
  }

  return stats;
};

// Get entries from last 24 hours
export const getLast24HoursData = (): {
  intakeEntries: IntakeEntry[];
  symptomEntries: SymptomEntry[];
} => {
  const data = loadData();
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;

  return {
    intakeEntries: data.intakeEntries.filter(e => e.timestamp >= cutoff),
    symptomEntries: data.symptomEntries.filter(e => e.timestamp >= cutoff),
  };
};

// Get today's entries
export const getTodayEntries = (): {
  intakeEntries: IntakeEntry[];
  symptomEntries: SymptomEntry[];
} => {
  const data = loadData();
  const today = getTodayString();

  return {
    intakeEntries: data.intakeEntries.filter(
      e => getDateString(e.timestamp) === today
    ),
    symptomEntries: data.symptomEntries.filter(
      e => getDateString(e.timestamp) === today
    ),
  };
};

// Delete intake entry
export const deleteIntakeEntry = (id: string): void => {
  const data = loadData();
  data.intakeEntries = data.intakeEntries.filter(e => e.id !== id);
  saveData(data);
};

// Delete symptom entry
export const deleteSymptomEntry = (id: string): void => {
  const data = loadData();
  data.symptomEntries = data.symptomEntries.filter(e => e.id !== id);
  saveData(data);
};

// Clear all data
export const clearAllData = (): void => {
  saveData(getEmptyData());
};
