"use client";

import { useState } from 'react';
import { Plus, X, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Exercise } from '@/lib/types';

interface ExerciseTrackerProps {
  exercises: Exercise[];
  onAddExercise: (exercise: Exercise) => void;
  onRemoveExercise: (id: string) => void;
}

// Exercícios comuns com estimativa de calorias por minuto
const commonExercises = [
  { name: 'Caminhada', caloriesPerMin: 4 },
  { name: 'Corrida', caloriesPerMin: 10 },
  { name: 'Ciclismo', caloriesPerMin: 8 },
  { name: 'Natação', caloriesPerMin: 9 },
  { name: 'Musculação', caloriesPerMin: 6 },
  { name: 'Yoga', caloriesPerMin: 3 },
  { name: 'Dança', caloriesPerMin: 7 },
  { name: 'Futebol', caloriesPerMin: 9 },
];

export function ExerciseTracker({ exercises, onAddExercise, onRemoveExercise }: ExerciseTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [customExercise, setCustomExercise] = useState({
    name: '',
    duration: '',
    calories: '',
  });

  const handleAddCommonExercise = () => {
    if (!selectedExercise || !duration) return;

    const exercise = commonExercises.find(e => e.name === selectedExercise);
    if (!exercise) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exercise.name,
      duration: Number(duration),
      caloriesBurned: exercise.caloriesPerMin * Number(duration),
      timestamp: Date.now(),
    };

    onAddExercise(newExercise);
    setSelectedExercise('');
    setDuration('');
  };

  const handleAddCustomExercise = () => {
    if (!customExercise.name || !customExercise.duration || !customExercise.calories) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: customExercise.name,
      duration: Number(customExercise.duration),
      caloriesBurned: Number(customExercise.calories),
      timestamp: Date.now(),
    };

    onAddExercise(newExercise);
    setCustomExercise({ name: '', duration: '', calories: '' });
    setShowForm(false);
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Exercícios</h2>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {/* Formulário de exercícios */}
      {showForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={customExercise.name ? 'outline' : 'default'}
              onClick={() => setCustomExercise({ name: '', duration: '', calories: '' })}
              className="flex-1"
            >
              Comum
            </Button>
            <Button
              size="sm"
              variant={customExercise.name ? 'default' : 'outline'}
              onClick={() => {
                setSelectedExercise('');
                setDuration('');
              }}
              className="flex-1"
            >
              Personalizado
            </Button>
          </div>

          {!customExercise.name ? (
            // Formulário de exercício comum
            <>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Selecione um exercício</option>
                {commonExercises.map((ex) => (
                  <option key={ex.name} value={ex.name}>
                    {ex.name} (~{ex.caloriesPerMin} kcal/min)
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Duração (minutos)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Button onClick={handleAddCommonExercise} className="w-full bg-blue-500 hover:bg-blue-600">
                Adicionar Exercício
              </Button>
            </>
          ) : (
            // Formulário personalizado
            <>
              <Input
                placeholder="Nome do exercício"
                value={customExercise.name}
                onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Duração (min)"
                  value={customExercise.duration}
                  onChange={(e) => setCustomExercise({ ...customExercise, duration: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Calorias queimadas"
                  value={customExercise.calories}
                  onChange={(e) => setCustomExercise({ ...customExercise, calories: e.target.value })}
                />
              </div>
              <Button onClick={handleAddCustomExercise} className="w-full bg-blue-500 hover:bg-blue-600">
                Adicionar Exercício
              </Button>
            </>
          )}
        </div>
      )}

      {/* Lista de exercícios */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Hoje</h3>
        {exercises.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">Nenhum exercício registrado hoje</p>
          </div>
        ) : (
          exercises.map((exercise) => (
            <div key={exercise.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{exercise.name}</p>
                <p className="text-xs text-gray-500">
                  {exercise.duration} min • {exercise.caloriesBurned} kcal queimadas
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveExercise(exercise.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
