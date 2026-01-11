export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  tmb: number; // Taxa Metabólica Basal
  tdee: number; // Total Daily Energy Expenditure
  goal: number; // Meta de calorias diárias
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  quantity?: number; // quantidade em gramas ou porção
}

export interface FoodLog {
  id: string;
  userId: string;
  foodId: string;
  foodName: string;
  calories: number;
  date: string; // YYYY-MM-DD
  timestamp: number; // unix timestamp
  quantity?: number;
}

export interface DailyCalories {
  date: string;
  totalCalories: number;
  goal: number;
  remaining: number;
  percentage: number;
  entries: FoodLog[];
}

export interface WeeklySummary {
  week: number;
  year: number;
  totalCalories: number;
  averageCalories: number;
  goal: number;
  days: DailyCalories[];
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalCalories: number;
  averageCalories: number;
  goal: number;
  weeks: WeeklySummary[];
}
