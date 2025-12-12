'use client';

import { useState, useEffect, useCallback } from 'react';
import { IntakeEntry, SymptomEntry, DailyStats } from '@/lib/types';
import {
  loadData,
  addIntakeEntry as addIntake,
  addSymptomEntry as addSymptom,
  getDailyStats,
  getWeeklyStats,
  getTodayString,
  getTodayEntries,
  getLast24HoursData,
  deleteIntakeEntry,
  deleteSymptomEntry,
} from '@/lib/storage';

export function useAppData() {
  const [intakeEntries, setIntakeEntries] = useState<IntakeEntry[]>([]);
  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>([]);
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refresh all data from storage
  const refreshData = useCallback(() => {
    const data = loadData();
    const today = getTodayEntries();

    setIntakeEntries(data.intakeEntries);
    setSymptomEntries(data.symptomEntries);
    setTodayStats(getDailyStats(getTodayString()));
    setWeeklyStats(getWeeklyStats(7));

    return today;
  }, []);

  // Load initial data
  useEffect(() => {
    refreshData();
    setIsLoaded(true);
  }, [refreshData]);

  // Add new intake entry
  const addIntakeEntry = useCallback(
    (
      waterMl: number,
      temperature: number,
      electrolyteScoops: number,
      saltTsp: number
    ) => {
      const entry = addIntake(waterMl, temperature, electrolyteScoops, saltTsp);
      refreshData();
      return entry;
    },
    [refreshData]
  );

  // Add new symptom entry
  const addSymptomEntry = useCallback(
    (type: string) => {
      const entry = addSymptom(type);
      refreshData();
      return entry;
    },
    [refreshData]
  );

  // Delete intake entry
  const removeIntakeEntry = useCallback(
    (id: string) => {
      deleteIntakeEntry(id);
      refreshData();
    },
    [refreshData]
  );

  // Delete symptom entry
  const removeSymptomEntry = useCallback(
    (id: string) => {
      deleteSymptomEntry(id);
      refreshData();
    },
    [refreshData]
  );

  // Get last 24 hours data for AI analysis
  const getLast24Hours = useCallback(() => {
    return getLast24HoursData();
  }, []);

  return {
    intakeEntries,
    symptomEntries,
    todayStats,
    weeklyStats,
    isLoaded,
    addIntakeEntry,
    addSymptomEntry,
    removeIntakeEntry,
    removeSymptomEntry,
    getLast24Hours,
    refreshData,
  };
}
