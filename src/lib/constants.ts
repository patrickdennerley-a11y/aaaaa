// Electrolyte constants for calculations
export const ELECTROLYTE_SCOOP = {
  sodium: 200, // mg per scoop
  potassium: 200, // mg per scoop
};

export const TABLE_SALT_TSP = {
  sodium: 2300, // mg per teaspoon
  potassium: 0, // mg per teaspoon
};

// Safety thresholds
export const POTASSIUM_WARNING_THRESHOLD = 200; // mg per liter
export const TEMP_WARNING_THRESHOLD = 50; // degrees Celsius
export const TEMP_TARGET_MIN = 45; // degrees Celsius
export const TEMP_TARGET_MAX = 50; // degrees Celsius

// Symptom types
export const SYMPTOM_TYPES = [
  { id: 'cold_hands', label: 'Cold Hands', icon: 'Snowflake', color: 'bg-blue-600' },
  { id: 'nausea', label: 'Nausea', icon: 'Frown', color: 'bg-yellow-600' },
  { id: 'brain_fog', label: 'Brain Fog', icon: 'Cloud', color: 'bg-purple-600' },
  { id: 'feeling_good', label: 'Feeling Good', icon: 'Smile', color: 'bg-green-600' },
] as const;

export type SymptomType = typeof SYMPTOM_TYPES[number]['id'];
