import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export interface ProviderConfig {
  id: string;
  name: string;
  type: 'text-llm' | 'image-engine';
  provider: 'google' | 'openai' | 'custom' | 'midjourney' | 'nano-banana';
  apiKey: string;
  baseUrl?: string;
  modelName?: string;
}

export const getAIConfigs = (): ProviderConfig[] => {
  const defaults: ProviderConfig[] = [
    {
      id: 'default-gemini',
      name: 'Google Gemini (Text & Copy AI)',
      type: 'text-llm',
      provider: 'google',
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
      modelName: 'gemini-2.5-flash-preview-09-2025'
    },
    {
      id: 'default-midjourney',
      name: 'Midjourney v6 (Image Compiler)',
      type: 'image-engine',
      provider: 'midjourney',
      apiKey: ''
    },
    {
      id: 'default-dalle',
      name: 'DALL-E 3 / OpenAI (Image Compiler)',
      type: 'image-engine',
      provider: 'openai',
      apiKey: ''
    },
    {
      id: 'default-stable-diffusion',
      name: 'Stable Diffusion (Image Compiler)',
      type: 'image-engine',
      provider: 'custom',
      apiKey: ''
    }
  ];

  if (typeof window === 'undefined') {
    return defaults;
  }
  
  const saved = localStorage.getItem('ai_configs');
  if (saved) {
    try {
      const parsed: ProviderConfig[] = JSON.parse(saved);
      // Auto-migrate: if the user only has text-llm engines, append the default image engines
      const hasImageEngine = parsed.some(c => c.type === 'image-engine');
      if (!hasImageEngine) {
        const merged = [...parsed, ...defaults.filter(d => d.type === 'image-engine')];
        localStorage.setItem('ai_configs', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse AI configs', e);
    }
  }

  const legacySaved = localStorage.getItem('ai_config');
  if (legacySaved) {
    try {
      const parsed = JSON.parse(legacySaved);
      const legacy: ProviderConfig = {
        id: 'legacy-config',
        name: 'Legacy Text Assistant',
        type: 'text-llm',
        provider: parsed.provider || 'google',
        apiKey: parsed.apiKey || '',
        baseUrl: parsed.baseUrl,
        modelName: parsed.modelName
      };
      const merged = [legacy, ...defaults.filter(d => d.id !== 'default-gemini')];
      localStorage.setItem('ai_configs', JSON.stringify(merged));
      return merged;
    } catch (e) {}
  }
  
  localStorage.setItem('ai_configs', JSON.stringify(defaults));
  return defaults;
};

export const fetchAI = async (prompt: string, systemInstruction = "You are a helpful assistant.", signal?: AbortSignal) => {
  const configs = getAIConfigs();
  const config = configs.find(c => c.type === 'text-llm') || configs[0];
  
  if (!config) throw new Error('No text-llm provider configured');
  
  let model;
  
  if (config.provider === 'google') {
    const google = createGoogleGenerativeAI({ 
      apiKey: config.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
    });
    model = google(config.modelName || 'gemini-2.5-flash-preview-09-2025');
  } else if (config.provider === 'openai') {
    const openai = createOpenAI({ 
      apiKey: config.apiKey || ''
    });
    model = openai(config.modelName || 'gpt-4o');
  } else if (config.provider === 'custom') {
    // Ollama, LM Studio, etc. (OpenAI API Compatible)
    const custom = createOpenAI({
      baseURL: config.baseUrl || 'http://localhost:11434/v1',
      apiKey: config.apiKey || 'not-needed',
    });
    model = custom(config.modelName || 'llama3');
  } else {
    throw new Error('Unsupported AI provider');
  }

  const retries = 5;
  const delays = [1000, 2000, 4000, 8000, 16000];

  for (let i = 0; i < retries; i++) {
    try {
      const { text } = await generateText({
        model,
        system: systemInstruction,
        prompt,
        abortSignal: signal,
      });
      return text;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
};
