// Utilitários para Local Storage
import { UserProfile, FoodItem, Exercise, DailyGoal } from './types';

const STORAGE_KEY = 'calorie-counter-data';

const defaultGoal: DailyGoal = {
  calorieTarget: 2000,
  proteinTarget: 150,
  carbsTarget: 250,
  fatTarget: 65,
};

export const getStoredData = (): UserProfile => {
  if (typeof window === 'undefined') {
    return {
      name: 'Usuário',
      dailyGoal: defaultGoal,
      foods: [],
      exercises: [],
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      name: 'Usuário',
      dailyGoal: defaultGoal,
      foods: [],
      exercises: [],
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      name: 'Usuário',
      dailyGoal: defaultGoal,
      foods: [],
      exercises: [],
    };
  }
};

export const saveData = (data: UserProfile) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const addFood = (food: FoodItem) => {
  const data = getStoredData();
  data.foods.push(food);
  saveData(data);
  return data;
};

export const removeFood = (id: string) => {
  const data = getStoredData();
  data.foods = data.foods.filter(f => f.id !== id);
  saveData(data);
  return data;
};

export const addExercise = (exercise: Exercise) => {
  const data = getStoredData();
  data.exercises.push(exercise);
  saveData(data);
  return data;
};

export const removeExercise = (id: string) => {
  const data = getStoredData();
  data.exercises = data.exercises.filter(e => e.id !== id);
  saveData(data);
  return data;
};

export const updateDailyGoal = (goal: DailyGoal) => {
  const data = getStoredData();
  data.dailyGoal = goal;
  saveData(data);
  return data;
};

export const getTodayData = (data: UserProfile) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const todayFoods = data.foods.filter(f => f.timestamp >= todayTimestamp);
  const todayExercises = data.exercises.filter(e => e.timestamp >= todayTimestamp);

  const totalCalories = todayFoods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = todayFoods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = todayFoods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = todayFoods.reduce((sum, f) => sum + f.fat, 0);
  const caloriesBurned = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);

  return {
    foods: todayFoods,
    exercises: todayExercises,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    caloriesBurned,
    netCalories: totalCalories - caloriesBurned,
  };
};
