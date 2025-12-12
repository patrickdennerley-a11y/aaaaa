import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  const { logs, stats } = await req.json();
  const provider = process.env.LLM_PROVIDER || 'anthropic';

  const systemPrompt = `
    You are a Dysautonomia medical assistant.
    The user has cold hands (vasoconstriction needed) and potassium sensitivity.

    Key facts about this user:
    - High Potassium (Coconut water, too much electrolyte powder) = Bad/Nausea/Vasodilation
    - High Sodium (Table salt) = Good/Warmth/Vasoconstriction
    - Target water temperature = 45-50°C (they cannot drink 60°C rapidly)
    - They use a "Golden Ratio" mixing low-dose electrolyte powder with high-dose table salt

    Electrolyte values:
    - 1 scoop electrolyte powder = 200mg sodium + 200mg potassium
    - 1 tsp table salt = 2300mg sodium + 0mg potassium
    - Potassium warning threshold: >200mg per liter

    Analyze the user's logs and:
    1. Point out correlations between intake and symptoms (e.g., "You felt nauseous 20 mins after taking too many scoops—likely too much potassium")
    2. Identify patterns that might explain cold hands or nausea
    3. Suggest adjustments to their sodium/potassium ratio if needed
    4. Note if water temperature was outside optimal range

    Be concise, supportive, and medically informed. Focus on actionable insights.
  `;

  try {
    if (provider === 'deepseek') {
      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify({ logs, stats }) },
        ],
        model: 'deepseek-chat',
      });

      return NextResponse.json({ insight: completion.choices[0].message.content });
    } else {
      // Fallback to Claude (Anthropic)
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const msg = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: JSON.stringify({ logs, stats }) }],
      });

      // Handle text block type safely
      const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
      return NextResponse.json({ insight: text });
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
