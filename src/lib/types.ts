// Tipos para o app de Contador de Calorias

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

export interface Exercise {
  id: string;
  name: string;
  duration: number; // em minutos
  caloriesBurned: number;
  timestamp: number;
}

export interface DailyGoal {
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

export interface UserProfile {
  name: string;
  dailyGoal: DailyGoal;
  foods: FoodItem[];
  exercises: Exercise[];
}
