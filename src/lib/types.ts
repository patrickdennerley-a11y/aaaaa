import { SymptomType } from './constants';

export interface IntakeEntry {
  id: string;
  timestamp: number;
  waterMl: number;
  temperature: number;
  electrolyteScoops: number;
  saltTsp: number;
  sodiumMg: number;
  potassiumMg: number;
}

export interface SymptomEntry {
  id: string;
  timestamp: number;
  type: SymptomType;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalSodiumMg: number;
  totalPotassiumMg: number;
  totalFluidMl: number;
  intakeCount: number;
}

export interface AppData {
  intakeEntries: IntakeEntry[];
  symptomEntries: SymptomEntry[];
}
