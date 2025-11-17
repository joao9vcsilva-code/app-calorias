import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API OpenAI não configurada' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de alimento e forneça as informações nutricionais estimadas em formato JSON.

Retorne APENAS um objeto JSON válido com esta estrutura exata:
{
  "name": "nome do alimento identificado",
  "calories": número estimado de calorias,
  "protein": gramas de proteína,
  "carbs": gramas de carboidratos,
  "fat": gramas de gordura,
  "portion": "descrição da porção estimada (ex: '1 prato', '100g', '1 unidade')",
  "confidence": "alta/média/baixa"
}

Seja preciso e realista nas estimativas. Se não conseguir identificar claramente, use confidence "baixa".`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Não foi possível analisar a imagem' },
        { status: 500 }
      );
    }

    // Extrair JSON da resposta
    let foodData;
    try {
      // Tentar parsear diretamente
      foodData = JSON.parse(content);
    } catch {
      // Se falhar, tentar extrair JSON de markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        foodData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('Resposta não está em formato JSON válido');
      }
    }

    return NextResponse.json(foodData);
  } catch (error) {
    console.error('Erro ao analisar alimento:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a imagem' },
      { status: 500 }
    );
  }
}
