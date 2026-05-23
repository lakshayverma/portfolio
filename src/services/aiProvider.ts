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
  if (typeof window === 'undefined') {
    return [{
      id: 'default-gemini',
      name: 'Default Gemini',
      type: 'text-llm',
      provider: 'google',
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
      modelName: 'gemini-2.5-flash-preview-09-2025'
    }];
  }
  
  const saved = localStorage.getItem('ai_configs');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse AI configs', e);
    }
  }

  const legacySaved = localStorage.getItem('ai_config');
  if (legacySaved) {
    try {
      const parsed = JSON.parse(legacySaved);
      return [{
        id: 'legacy-config',
        name: 'Legacy Text Assistant',
        type: 'text-llm',
        provider: parsed.provider || 'google',
        apiKey: parsed.apiKey || '',
        baseUrl: parsed.baseUrl,
        modelName: parsed.modelName
      }];
    } catch (e) {}
  }
  
  return [{
    id: 'default-gemini',
    name: 'Default Gemini',
    type: 'text-llm',
    provider: 'google',
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    modelName: 'gemini-2.5-flash-preview-09-2025'
  }];
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
