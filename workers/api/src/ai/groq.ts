import type { Env } from '../types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGroqAI(
  env: Env,
  messages: ChatMessage[],
  preferredModel?: string
): Promise<{ content: string; modelUsed: string; durationMs: number }> {
  const apiKey = env.GROQ_API_KEY || (typeof process !== 'undefined' ? process.env?.GROQ_API_KEY : '');
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment or Cloudflare Worker bindings.');
  }
  const primaryModel = preferredModel || env.GROQ_MODEL || 'openai/gpt-oss-120b';
  const fallbackModel = env.GROQ_FALLBACK_MODEL || 'qwen/qwen3.8-27b';

  const startTime = Date.now();

  const tryModel = async (model: string) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API error (${res.status}): ${errText}`);
    }

    const data: any = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    return {
      content,
      modelUsed: model,
      durationMs: Date.now() - startTime,
    };
  };

  try {
    return await tryModel(primaryModel);
  } catch (err: any) {
    console.warn(`Primary model ${primaryModel} failed, trying fallback ${fallbackModel}:`, err.message);
    try {
      return await tryModel(fallbackModel);
    } catch (fallbackErr: any) {
      console.error('All Groq models failed:', fallbackErr.message);
      throw fallbackErr;
    }
  }
}
