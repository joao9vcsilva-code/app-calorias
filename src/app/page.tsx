"use client";

import { useState, useEffect } from 'react';
import { Apple, Activity } from 'lucide-react';
import { FoodLogger } from '@/components/custom/food-logger';
import { ExerciseTracker } from '@/components/custom/exercise-tracker';
import { CalorieChart } from '@/components/custom/calorie-chart';
import { AIAssistant } from '@/components/custom/ai-assistant';
import { FoodItem, Exercise, UserProfile } from '@/lib/types';
import {
  getStoredData,
  addFood,
  removeFood,
  addExercise,
  removeExercise,
  getTodayData,
} from '@/lib/storage';

export default function Home() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUserData(getStoredData());
  }, []);

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const todayData = getTodayData(userData);

  const handleAddFood = (food: FoodItem) => {
    const newData = addFood(food);
    setUserData(newData);
  };

  const handleRemoveFood = (id: string) => {
    const newData = removeFood(id);
    setUserData(newData);
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newData = addExercise(exercise);
    setUserData(newData);
  };

  const handleRemoveExercise = (id: string) => {
    const newData = removeExercise(id);
    setUserData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Contador de Calorias
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">Monitore sua saúde com IA</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Ativo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Gráfico e IA */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de Calorias */}
            <CalorieChart
              totalCalories={todayData.totalCalories}
              caloriesBurned={todayData.caloriesBurned}
              netCalories={todayData.netCalories}
              calorieTarget={userData.dailyGoal.calorieTarget}
              totalProtein={todayData.totalProtein}
              totalCarbs={todayData.totalCarbs}
              totalFat={todayData.totalFat}
              proteinTarget={userData.dailyGoal.proteinTarget}
              carbsTarget={userData.dailyGoal.carbsTarget}
              fatTarget={userData.dailyGoal.fatTarget}
            />

            {/* Assistente IA */}
            <AIAssistant
              totalCalories={todayData.totalCalories}
              calorieTarget={userData.dailyGoal.calorieTarget}
              caloriesBurned={todayData.caloriesBurned}
            />
          </div>

          {/* Coluna Direita - Registro de Alimentos e Exercícios */}
          <div className="space-y-6">
            {/* Registro de Alimentos */}
            <FoodLogger
              foods={todayData.foods}
              onAddFood={handleAddFood}
              onRemoveFood={handleRemoveFood}
            />

            {/* Rastreador de Exercícios */}
            <ExerciseTracker
              exercises={todayData.exercises}
              onAddExercise={handleAddExercise}
              onRemoveExercise={handleRemoveExercise}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Dica: Mantenha uma alimentação equilibrada e pratique exercícios regularmente
          </p>
        </div>
      </main>
    </div>
  );
}
