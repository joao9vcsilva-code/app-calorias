"use client";

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, TrendingUp, Target } from 'lucide-react';

interface CalorieChartProps {
  totalCalories: number;
  caloriesBurned: number;
  netCalories: number;
  calorieTarget: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

export function CalorieChart({
  totalCalories,
  caloriesBurned,
  netCalories,
  calorieTarget,
  totalProtein,
  totalCarbs,
  totalFat,
  proteinTarget,
  carbsTarget,
  fatTarget,
}: CalorieChartProps) {
  const calorieProgress = Math.min((netCalories / calorieTarget) * 100, 100);
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);
  const carbsProgress = Math.min((totalCarbs / carbsTarget) * 100, 100);
  const fatProgress = Math.min((totalFat / fatTarget) * 100, 100);

  const remaining = Math.max(calorieTarget - netCalories, 0);

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Resumo de Hoje</h2>
      </div>

      {/* Resumo principal */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
          <p className="text-xs text-emerald-700 mb-1">Consumidas</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">{totalCalories}</p>
          <p className="text-xs text-emerald-600">kcal</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-xs text-blue-700 mb-1">Queimadas</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{caloriesBurned}</p>
          <p className="text-xs text-blue-600">kcal</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <p className="text-xs text-purple-700 mb-1">Restantes</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{remaining}</p>
          <p className="text-xs text-purple-600">kcal</p>
        </div>
      </div>

      {/* Progresso de calorias */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Meta Diária</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {netCalories} / {calorieTarget} kcal
          </span>
        </div>
        <Progress value={calorieProgress} className="h-3" />
        <p className="text-xs text-gray-500 mt-1">
          {calorieProgress >= 100 ? 'Meta atingida! 🎉' : `${calorieProgress.toFixed(0)}% da meta`}
        </p>
      </div>

      {/* Macronutrientes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">Macronutrientes</h3>
        </div>

        {/* Proteína */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Proteína</span>
            <span className="text-xs font-semibold text-emerald-600">
              {totalProtein}g / {proteinTarget}g
            </span>
          </div>
          <Progress value={proteinProgress} className="h-2 bg-emerald-100" />
        </div>

        {/* Carboidratos */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Carboidratos</span>
            <span className="text-xs font-semibold text-blue-600">
              {totalCarbs}g / {carbsTarget}g
            </span>
          </div>
          <Progress value={carbsProgress} className="h-2 bg-blue-100" />
        </div>

        {/* Gordura */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Gordura</span>
            <span className="text-xs font-semibold text-orange-600">
              {totalFat}g / {fatTarget}g
            </span>
          </div>
          <Progress value={fatProgress} className="h-2 bg-orange-100" />
        </div>
      </div>
    </Card>
  );
}
