import Handlebars from 'handlebars';
import { PromptConfig } from './db';

// Helper to expand a deep template using the dictionary
export const resolveDeepTemplate = (
  category: string,
  value: string,
  fallbackPrefix: string,
  config: PromptConfig,
  dictionaries: any
): string => {
  if (!value) return '';
  const dict = dictionaries[category];
  const templateStr = (dict && dict[value]) ? dict[value] : `${fallbackPrefix} ${value}`;
  return interpolateTemplate(templateStr, config);
};

// Interpolate template using Handlebars
export const interpolateTemplate = (str: string, config: PromptConfig): string => {
  if (!str) return '';
  try {
    const template = Handlebars.compile(str);
    
    // Create a view model that converts arrays to strings, etc.
    const viewModel: any = { ...config };
    
    // Provide string representations for ease of use in templates
    viewModel.tone = Array.isArray(config.tone) ? config.tone.join(', ') : '';
    viewModel.platform = Array.isArray(config.platform) ? config.platform.join(' and ') : '';
    
    const activeElements = config.additionalElements 
      ? Object.entries(config.additionalElements).filter(([_,v])=>v).map(([k])=>k).join(', ')
      : '';
    (viewModel as any).activeElements = activeElements;
    
    return template(viewModel);
  } catch (error) {
    console.error('Handlebars compilation error:', error);
    return str; // Fallback to raw string if there's a syntax error
  }
};
