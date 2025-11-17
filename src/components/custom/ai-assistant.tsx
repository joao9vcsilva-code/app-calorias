"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  totalCalories: number;
  calorieTarget: number;
  caloriesBurned: number;
}

export function AIAssistant({ totalCalories, calorieTarget, caloriesBurned }: AIAssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu assistente de saúde. Posso te ajudar com dicas de alimentação, sugestões de exercícios e orientações para atingir suas metas. Como posso ajudar você hoje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const context = `
Contexto do usuário:
- Calorias consumidas hoje: ${totalCalories} kcal
- Meta diária de calorias: ${calorieTarget} kcal
- Calorias queimadas em exercícios: ${caloriesBurned} kcal
- Calorias líquidas: ${totalCalories - caloriesBurned} kcal
- Restante para a meta: ${Math.max(calorieTarget - (totalCalories - caloriesBurned), 0)} kcal
`;

      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context,
        }),
      });

      if (!response.ok) throw new Error('Erro ao obter resposta');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente em alguns instantes.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickTips = [
    'Dicas de alimentação saudável',
    'Sugestões de exercícios',
    'Como atingir minha meta?',
  ];

  return (
    <Card className="p-4 sm:p-6 flex flex-col h-[500px]">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Assistente IA</h2>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Dicas rápidas */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickTips.map((tip, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              onClick={() => setInput(tip)}
              className="text-xs"
            >
              {tip}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="resize-none"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
