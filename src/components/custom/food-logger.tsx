"use client";

import { useState, useRef } from 'react';
import { Plus, Search, X, Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FoodItem } from '@/lib/types';

interface FoodLoggerProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (id: string) => void;
}

// Base de dados simples de alimentos comuns
const commonFoods = [
  { name: 'Arroz (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Feijão (100g)', calories: 77, protein: 4.5, carbs: 14, fat: 0.5 },
  { name: 'Frango Grelhado (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Ovo (unidade)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: 'Banana (unidade)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Maçã (unidade)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Pão Francês (unidade)', calories: 135, protein: 4.5, carbs: 26, fat: 1.5 },
  { name: 'Batata Doce (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'Salmão (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Aveia (100g)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
];

export function FoodLogger({ foods, onAddFood, onRemoveFood }: FoodLoggerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analyzedFood, setAnalyzedFood] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCommonFood = (food: typeof commonFoods[0]) => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      ...food,
      timestamp: Date.now(),
    };
    onAddFood(newFood);
    setSearchTerm('');
  };

  const handleAddCustomFood = () => {
    if (!customFood.name || !customFood.calories) return;

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: customFood.name,
      calories: Number(customFood.calories),
      protein: Number(customFood.protein) || 0,
      carbs: Number(customFood.carbs) || 0,
      fat: Number(customFood.fat) || 0,
      timestamp: Date.now(),
    };

    onAddFood(newFood);
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowCustomForm(false);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      analyzeFood(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFood = async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalyzedFood(null);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageData }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar imagem');
      }

      const data = await response.json();
      setAnalyzedFood(data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao analisar a imagem. Verifique se a chave da OpenAI está configurada.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddAnalyzedFood = () => {
    if (!analyzedFood) return;

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: `${analyzedFood.name} (${analyzedFood.portion})`,
      calories: analyzedFood.calories,
      protein: analyzedFood.protein,
      carbs: analyzedFood.carbs,
      fat: analyzedFood.fat,
      timestamp: Date.now(),
    };

    onAddFood(newFood);
    
    // Resetar estado
    setPhotoPreview(null);
    setAnalyzedFood(null);
    setShowPhotoCapture(false);
  };

  const handleCancelPhoto = () => {
    setPhotoPreview(null);
    setAnalyzedFood(null);
    setShowPhotoCapture(false);
    setIsAnalyzing(false);
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Registro de Alimentos</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              setShowPhotoCapture(!showPhotoCapture);
              setShowCustomForm(false);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Camera className="w-4 h-4 mr-1" />
            Foto
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setShowCustomForm(!showCustomForm);
              setShowPhotoCapture(false);
            }}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Manual
          </Button>
        </div>
      </div>

      {/* Captura de foto */}
      {showPhotoCapture && (
        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Registrar por Fotografia
          </h3>
          
          {!photoPreview ? (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Tirar Foto ou Selecionar Imagem
              </Button>
              <p className="text-xs text-gray-600 text-center">
                Tire uma foto do seu alimento e a IA identificará automaticamente as calorias
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Preview da imagem */}
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Analisando alimento...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Resultado da análise */}
              {analyzedFood && !isAnalyzing && (
                <div className="bg-white p-4 rounded-lg border-2 border-emerald-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{analyzedFood.name}</h4>
                      <p className="text-xs text-gray-500">{analyzedFood.portion}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Confiança: {analyzedFood.confidence === 'alta' ? '🟢' : analyzedFood.confidence === 'média' ? '🟡' : '🔴'} {analyzedFood.confidence}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600">
                      {analyzedFood.calories} kcal
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-xs text-gray-600">Proteína</p>
                      <p className="font-semibold text-blue-600">{analyzedFood.protein}g</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded">
                      <p className="text-xs text-gray-600">Carboidratos</p>
                      <p className="font-semibold text-orange-600">{analyzedFood.carbs}g</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="text-xs text-gray-600">Gordura</p>
                      <p className="font-semibold text-yellow-600">{analyzedFood.fat}g</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddAnalyzedFood}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      Adicionar ao Diário
                    </Button>
                    <Button
                      onClick={handleCancelPhoto}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {!isAnalyzing && !analyzedFood && (
                <Button
                  onClick={handleCancelPhoto}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Busca de alimentos */}
      {!showPhotoCapture && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar alimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Lista de alimentos comuns */}
      {searchTerm && !showPhotoCapture && (
        <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
          {filteredFoods.map((food, index) => (
            <button
              key={index}
              onClick={() => handleAddCommonFood(food)}
              className="w-full text-left p-3 rounded-lg border hover:bg-emerald-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{food.name}</span>
                <span className="text-sm text-emerald-600 font-semibold">{food.calories} kcal</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Formulário customizado */}
      {showCustomForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <Input
            placeholder="Nome do alimento"
            value={customFood.name}
            onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Calorias"
              value={customFood.calories}
              onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Proteína (g)"
              value={customFood.protein}
              onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Carboidratos (g)"
              value={customFood.carbs}
              onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Gordura (g)"
              value={customFood.fat}
              onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
            />
          </div>
          <Button onClick={handleAddCustomFood} className="w-full bg-emerald-500 hover:bg-emerald-600">
            Adicionar Alimento
          </Button>
        </div>
      )}

      {/* Lista de alimentos adicionados hoje */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Hoje</h3>
        {foods.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Nenhum alimento registrado hoje</p>
        ) : (
          foods.map((food) => (
            <div key={food.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{food.name}</p>
                <p className="text-xs text-gray-500">
                  {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveFood(food.id)}
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
