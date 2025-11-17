import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          message: 'Para usar o assistente de IA, configure sua chave da OpenAI nas variáveis de ambiente (OPENAI_API_KEY).',
        },
        { status: 200 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente de saúde amigável e motivador especializado em nutrição e exercícios. 
Seu objetivo é ajudar os usuários a atingir suas metas de saúde de forma sustentável e saudável.

Diretrizes:
- Seja encorajador e positivo
- Forneça dicas práticas e acionáveis
- Considere o contexto do usuário ao dar sugestões
- Não dê conselhos médicos específicos, apenas orientações gerais de bem-estar
- Seja conciso mas informativo (máximo 150 palavras)
- Use emojis ocasionalmente para tornar a conversa mais amigável

${context}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Erro na API do assistente:', error);
    return NextResponse.json(
      {
        message: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.',
      },
      { status: 500 }
    );
  }
}
