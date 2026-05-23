"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Sparkles, Copy, CheckCircle2, SplitSquareHorizontal, RotateCcw, Undo2, Wand2, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Combobox } from '@/components/Combobox';
import { MultiSelect } from '@/components/MultiSelect';
import { AspectRatioVisualizer } from '@/components/Visualizers/AspectRatioVisualizer';
import { TextPlacementGrid } from '@/components/Visualizers/TextPlacementGrid';
import { ImageStyleGrid } from '@/components/Visualizers/ImageStyleGrid';
import { TimeOfDayVisualizer } from '@/components/Visualizers/TimeOfDayVisualizer';
import { ToneVisualizer } from '@/components/Visualizers/ToneVisualizer';
import { FontStyleGrid } from '@/components/Visualizers/FontStyleGrid';
import { GoalVisualizer } from '@/components/Visualizers/GoalVisualizer';
import { SubjectVisualizer } from '@/components/Visualizers/SubjectVisualizer';
import { PlatformVisualizer } from '@/components/Visualizers/PlatformVisualizer';
import { PromptConfig, getAllFromDB, saveToDB } from '@/services/db';
import { fetchAI, getAIConfigs, ProviderConfig } from '@/services/aiProvider';
import { resolveDeepTemplate, interpolateTemplate } from '@/services/promptEngine';
import { Flame, Tent, TreePine, Mountain, Star, CloudFog, Snowflake, Droplet, Skull, Coffee, Eye, Zap, Target, CloudRain } from 'lucide-react';

const ELEMENT_ICONS: Record<string, React.ElementType> = {
  'fire': Flame, 'camp': Tent, 'forest': TreePine, 'mountains': Mountain, 'stars': Star,
  'magic aura': Sparkles, 'rain': CloudRain, 'fog': CloudFog, 'snow': Snowflake, 'blood': Droplet
};

const TONE_ICONS: Record<string, React.ElementType> = {
  'Epic': Mountain, 'Grim': Skull, 'Cozy': Coffee, 'Mysterious': Eye,
  'Action-Packed': Zap, 'Tactical': Target
};

const DEFAULT_CONFIG: PromptConfig = {
  id: '',
  title: 'Untitled Prompt',
  outputContext: 'Image Prompt',
  promptSyntax: 'Midjourney',
  outputEngineId: 'default-gemini',
  subjectId: '',
  goal: [],
  description: '',
  timeOfDay: '',
  tone: [],
  primaryRatio: '16:9',
  secondaryRatio: '1:1',
  platform: ['YouTube'],
  textPlacements: '',
  fontStyle: '',
  imageStyle: '',
  keywords: [],
  scenery: '',
  additionalElements: {},
  customAdditions: '',
  summary: ''
};

const VARIABLE_COLORS: Record<string, string> = {
  subjectId: 'bg-red-500',
  goal: 'bg-orange-500',
  description: 'bg-yellow-500',
  timeOfDay: 'bg-emerald-500',
  imageStyle: 'bg-teal-500',
  fontStyle: 'bg-cyan-500',
  textPlacements: 'bg-sky-500',
  scenery: 'bg-blue-500',
  tone: 'bg-indigo-500',
  platform: 'bg-violet-500',
  keywords: 'bg-fuchsia-500',
  additionalElements: 'bg-pink-500',
  summary: 'bg-rose-500'
};

export default function Page() {
  const [appData, setAppData] = useState<any>(null);
  const [config, setConfig] = useState<PromptConfig>({ ...DEFAULT_CONFIG, id: Date.now().toString() });
  const [savedPrompts, setSavedPrompts] = useState<PromptConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiEngines, setAiEngines] = useState<ProviderConfig[]>([]);

  const [leftWidthPct, setLeftWidthPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'form' | 'output'>('form');

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  const [isEnhancingOutput, setIsEnhancingOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDraggingOverSummary, setIsDraggingOverSummary] = useState(false);
  const [compiledOutputs, setCompiledOutputs] = useState<Record<string, string>>({});
  const [isCompiling, setIsCompiling] = useState(false);
  const [lastFocusedInput, setLastFocusedInput] = useState<'description' | 'summary'>('summary');
  const [hasAIKey, setHasAIKey] = useState(false);
  const [magicFillController, setMagicFillController] = useState<AbortController | null>(null);
  const [enhanceController, setEnhanceController] = useState<AbortController | null>(null);
  const [enhancingOutputController, setEnhancingOutputController] = useState<AbortController | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);

    const savedSplit = localStorage.getItem('thumbnailAppSplitNext');
    if (savedSplit) setLeftWidthPct(parseFloat(savedSplit));

    const checkKey = () => {
      const configs = getAIConfigs();
      setAiEngines(configs);
      const activeEngine = configs.find(c => c.id === config.outputEngineId) || configs[0];
      const hasKeys = !!activeEngine?.apiKey || activeEngine?.provider === 'custom';
      setHasAIKey(hasKeys);
    };
    checkKey();
    window.addEventListener('ai_config_updated', checkKey);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('ai_config_updated', checkKey);
    };
  }, [config.outputEngineId]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        setAppData(data);

        let savedData = await getAllFromDB();

        if (savedData.length === 0 && data.subjects) {
          const templates: PromptConfig[] = [];
          data.subjects.forEach((subj: any) => {
            if (subj.templates) {
              subj.templates.forEach((t: any, i: number) => {
                if (typeof t === 'string') {
                  templates.push({
                    ...DEFAULT_CONFIG,
                    id: `template-${subj.id}-${i}`,
                    title: `${subj.name}: ${t}`,
                    subjectId: subj.id,
                    description: t,
                    summary: t,
                    primaryRatio: '16:9'
                  });
                } else {
                  const addElements = Object.fromEntries(
                    data.global.options.elements.map((el: string) => [el, (t.additionalElements || []).includes(el)])
                  );
                  templates.push({
                    ...DEFAULT_CONFIG,
                    id: `template-${subj.id}-${i}`,
                    title: `${subj.name}: ${t.title}`,
                    subjectId: subj.id,
                    description: t.description || '',
                    summary: t.summary || t.description || '',
                    timeOfDay: t.timeOfDay || '',
                    tone: Array.isArray(t.tone) ? t.tone : (t.tone ? [t.tone] : []),
                    imageStyle: t.imageStyle || '',
                    goal: Array.isArray(t.goal) ? t.goal : (t.goal ? [t.goal] : []),
                    platform: Array.isArray(t.platform) ? t.platform : (t.platform ? [t.platform] : []),
                    primaryRatio: t.primaryRatio || '16:9',
                    additionalElements: addElements,
                    keywords: t.keywords || []
                  });
                }
              });
            }
          });

          for (const t of templates) {
            await saveToDB(t);
          }
          savedData = await getAllFromDB();
        }

        if (savedData.length > 0) {
          setConfig(savedData[0]);
          setSavedPrompts(savedData);
        }
      } catch (err) {
        console.error("Initialization Error", err);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMobile) return;
      let newPct = (e.clientX / window.innerWidth) * 100;
      if (newPct < 30) newPct = 30;
      if (newPct > 70) newPct = 70;
      setLeftWidthPct(newPct);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem('thumbnailAppSplitNext', leftWidthPct.toString());
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, leftWidthPct, isMobile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleElementToggle = (element: string) => {
    setConfig((prev) => ({
      ...prev,
      additionalElements: {
        ...prev.additionalElements,
        [element]: !prev.additionalElements[element]
      }
    }));
  };

  const handleSave = async (isNew = false) => {
    if (!config.title.trim()) return alert('Please provide a title.');
    const configToSave = isNew ? { ...config, id: `custom-${Date.now()}` } : config;
    await saveToDB(configToSave);
    if (isNew) setConfig(configToSave);
    const data = await getAllFromDB();
    setSavedPrompts(data);
  };

  const handleEnhanceSubject = async () => {
    if (isEnhancing && enhanceController) {
      enhanceController.abort();
      return;
    }
    if (!config.description || !hasAIKey) return;
    setIsEnhancing(true);
    const controller = new AbortController();
    setEnhanceController(controller);
    try {
      const activeSubject = appData?.subjects.find((s: any) => s.id === config.subjectId);
      const subjectName = activeSubject ? activeSubject.name : 'Unknown';

      const prompt = `Expand this brief scene idea into a highly vivid, cinematic visual description suitable for an advanced image generation prompt. Focus heavily on dynamic action, lighting, textures, and strong composition. Do NOT return a full prompt, ONLY return the visual description of the subject/action itself. Keep it under 3 punchy sentences.
      Universe: ${subjectName}
      Current Idea: ${config.description}`;

      const result = await fetchAI(prompt, "You are a master art director creating vivid descriptions.", controller.signal);
      if (result) {
        setConfig(prev => ({ ...prev, description: result.trim() }));
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Enhance Error:", error);
      }
    } finally {
      setIsEnhancing(false);
      setEnhanceController(null);
    }
  };

  const handleMagicFill = async () => {
    if (isMagicFilling && magicFillController) {
      magicFillController.abort();
      return;
    }
    if (!config.description || !appData || !hasAIKey) return;
    setIsMagicFilling(true);
    const controller = new AbortController();
    setMagicFillController(controller);
    try {
      const subjects = appData.subjects?.map((s: any) => ({ id: s.id, name: s.name })) || [];
      const goals = Object.keys(appData.global?.dictionaries?.goal || {});
      const timesOfDay = Object.keys(appData.global?.dictionaries?.timeOfDay || {});
      const imageStyles = Object.keys(appData.global?.dictionaries?.imageStyle || {});
      const tones = Object.keys(appData.global?.dictionaries?.tone || {}).concat(Object.keys(appData.macros?.tones || {}));
      const keywords = Object.keys(appData.macros?.keywords || {});
      const elements = appData.global?.options?.elements || [];

      const prompt = `Analyze the visual scene description below and extract the best matching parameters from the provided lists to configure an art direction form.

Visual Description: "${config.description}"

Available Option Lists (Select ONLY character-for-character exact matches from these lists):
1. Subject ID (Must match one of these IDs): ${JSON.stringify(subjects.map((s: any) => s.id))} (For reference, names are: ${JSON.stringify(subjects)})
2. Goal (Must match one of these): ${JSON.stringify(goals)}
3. Time of Day (Must match one of these): ${JSON.stringify(timesOfDay)}
4. Image Style (Must match one of these): ${JSON.stringify(imageStyles)}
5. Tone (Select up to 3 best matching tones from this list): ${JSON.stringify(tones)}
6. Additional Elements (Identify which elements from this list are present/relevant): ${JSON.stringify(elements)}
7. Keywords (Select up to 5 matching tags from this list): ${JSON.stringify(keywords)}

Task:
1. Match the best parameters from the lists above.
2. Generate a highly detailed and premium "summary" text of the scene. Inside this summary, you MUST weave in variables in curly braces such as {{subjectId}}, {{timeOfDay}}, {{imageStyle}}, {{scenery}}, or {{tone}} in natural combinations to showcase variable interpolation.
   Example summary template: "A heroic warrior in {{subjectId}} standing ready for combat during {{timeOfDay}} hours, rendered in a striking {{imageStyle}} styling."

Return ONLY a valid, raw JSON object matching the schema below. Do NOT use markdown code blocks or add any comments.
If no options match for a single-select field, return "". If no options match for a list field, return [].

Schema:
{
  "subjectId": "string",
  "goal": "string",
  "timeOfDay": "string",
  "imageStyle": "string",
  "tone": ["string"],
  "additionalElements": {
    "elementName": true
  },
  "keywords": ["string"],
  "summary": "string containing variables like {{timeOfDay}}, {{imageStyle}}, {{tone}} etc."
}
`;

      const result = await fetchAI(prompt, "You are a precise JSON configuration generator. Output raw JSON only.");
      if (result) {
        const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        setConfig(prev => {
          const elementsMap: Record<string, boolean> = {};
          elements.forEach((el: string) => {
            elementsMap[el] = !!parsed.additionalElements?.[el];
          });

          return {
            ...prev,
            subjectId: parsed.subjectId || prev.subjectId,
            goal: parsed.goal ? [parsed.goal] : prev.goal,
            timeOfDay: parsed.timeOfDay || prev.timeOfDay,
            imageStyle: parsed.imageStyle || prev.imageStyle,
            tone: Array.isArray(parsed.tone) ? parsed.tone.filter((t: string) => tones.includes(t)) : prev.tone,
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords.filter((k: string) => keywords.includes(k)) : prev.keywords,
            summary: parsed.summary || prev.summary || parsed.description || prev.description,
            additionalElements: {
              ...prev.additionalElements,
              ...elementsMap
            }
          };
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Magic Fill Error:", error);
        alert("Failed to auto-configure. Please try again or refine your description.");
      }
    } finally {
      setIsMagicFilling(false);
      setMagicFillController(null);
    }
  };

  const handleEnhanceOutput = async (contextKey: string) => {
    if (isEnhancingOutput === contextKey && enhancingOutputController) {
      enhancingOutputController.abort();
      return;
    }
    const textToEnhance = config.compiledOutputOverrides?.[contextKey] || compiledOutputs[contextKey];
    if (!textToEnhance || !hasAIKey) return;
    
    setIsEnhancingOutput(contextKey);
    const controller = new AbortController();
    setEnhancingOutputController(controller);
    
    try {
      let prompt = '';
      if (contextKey === 'Image Prompt') {
        prompt = `You are a master digital art director. Take the raw image generation prompt below and enhance it to be extremely vivid, cinematic, and detailed. Add lighting, sensory, texture, and composition details.
        
Rules:
1. Preserve all core content.
2. If there are aspect ratio flags or versions at the end of the prompt (such as "--ar 16:9", "--style raw", "--v 6.0"), you MUST keep them EXACTLY as they are at the very end of your response.
3. Output ONLY the enhanced prompt itself. No quotes, no markdown code blocks, no conversation.

Raw Prompt:
"${textToEnhance}"`;
      } else {
        prompt = `You are a professional social media manager. Take the following generated content for ${contextKey} and enhance it to be highly engaging, premium, and well-structured.
        
Rules:
1. Preserve all hashtags and core information.
2. Output ONLY the final enhanced content. No quotes, no markdown blocks, no conversation.

Original Content:
"${textToEnhance}"`;
      }

      const result = await fetchAI(prompt, "You are a master content enhancer. You output ONLY the finalized enhanced text, with no preamble.", controller.signal);
      if (result) {
        setConfig(prev => ({ 
          ...prev, 
          compiledOutputOverrides: { ...(prev.compiledOutputOverrides || {}), [contextKey]: result.trim() }
        }));
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Enhance Output Error:", error);
        alert("Failed to enhance the output. Please try again.");
      }
    } finally {
      setIsEnhancingOutput(null);
      setEnhancingOutputController(null);
    }
  };

  const handleResetOutput = (contextKey: string) => {
    setConfig(prev => {
      const next = { ...prev };
      if (next.compiledOutputOverrides) {
        delete next.compiledOutputOverrides[contextKey];
      }
      return next;
    });
  };

  const insertVariable = (varStr: string) => {
    const inputName = lastFocusedInput;
    const input = document.getElementsByName(inputName)[0] as HTMLTextAreaElement;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = input.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + varStr + after;
      setConfig(prev => ({ ...prev, [inputName]: newText }));
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + varStr.length, start + varStr.length);
      }, 10);
    }
  };

  const compileOutput = (configData: PromptConfig): Record<string, string> => {
    if (!appData) return {};
    
    const engine = aiEngines.find(e => e.id === configData.outputEngineId) || aiEngines[0];
    const isImageEngine = engine?.type === 'image-engine';
    
    let contexts: string[] = [];
    if (isImageEngine) {
      contexts = ['Image Prompt'];
    } else {
      const platforms = configData.platform || [];
      if (platforms.length === 0) {
        contexts = ['Social Media Post'];
      } else {
        if (platforms.includes('YouTube') || platforms.includes('YouTube Shorts')) contexts.push('YouTube Description');
        if (platforms.includes('Twitter / X')) contexts.push('Twitter/X Post');
        if (platforms.includes('Instagram') || platforms.includes('TikTok')) contexts.push('Instagram Caption');
        if (contexts.length === 0) contexts = ['Social Media Post'];
      }
    }
    contexts = [...new Set(contexts)];

    const activeSubject = appData.subjects.find((s: any) => s.id === configData.subjectId);
    const subjectName = activeSubject ? activeSubject.name : configData.subjectId;
    const subjectDesc = activeSubject ? activeSubject.descriptionTemplate : '';

    const dicts = appData.global.dictionaries;
    const expandedSubject = subjectDesc ? interpolateTemplate(subjectDesc, configData) : `set in ${subjectName}`;
    const expandedTime = resolveDeepTemplate('timeOfDay', configData.timeOfDay, 'during', configData, dicts);
    const expandedStyle = resolveDeepTemplate('imageStyle', configData.imageStyle, 'rendered in a', configData, dicts);
    const expandedPlacement = resolveDeepTemplate('textPlacements', configData.textPlacements, 'leave space at', configData, dicts);
    const expandedFont = resolveDeepTemplate('fontStyle', configData.fontStyle, 'for', configData, dicts);
    const expandedGoals = (configData.goal || []).map(g => resolveDeepTemplate('goal', g, 'aiming for', configData, dicts)).join(' and ');

    const expandedTones = (configData.tone || []).map(t => resolveDeepTemplate('tone', t, 'feeling', configData, dicts)).join(' and ');
    const activeElementsList = Object.entries(configData.additionalElements || {}).filter(([_, v]) => v).map(([k]) => k);
    let unfurledElements: string[] = [];
    activeElementsList.forEach(el => {
      if (appData.macros.elements && appData.macros.elements[el]) {
        unfurledElements.push(...appData.macros.elements[el]);
      } else {
        unfurledElements.push(el);
      }
    });
    const activeElements = [...new Set(unfurledElements)].map(el => {
      return appData.global.dictionaries.elements?.[el] || el;
    }).join(', ');

    const hashtags = [...new Set([subjectName.replace(/\s+/g, ''), ...(configData.keywords || []).map(k => k.replace(/[\s@]+/g, ''))])]
      .filter(Boolean).map(t => `#${t}`).join(' ');

    const results: Record<string, string> = {};

    contexts.forEach(context => {
      if (context === 'YouTube Description') {
        results[context] = `🔥 ${configData.title} | ${subjectName}\n\n${interpolateTemplate(configData.summary || configData.description, configData)}\n\nWe are diving deep into ${subjectName} today. ${expandedSubject}. The vibe is ${configData.tone?.join(', ') || 'epic'} as our primary objective is: ${expandedGoals || 'exploration'}. \n\n${configData.scenery ? 'Current Location: ' + interpolateTemplate(configData.scenery, configData) : ''}\n${activeElements ? 'Things to look out for: ' + activeElements : ''}\n\n${interpolateTemplate(configData.customAdditions, configData)}\n\n${hashtags}`.trim();
      } else if (context === 'Image Prompt') {
        const baseDesc = `${interpolateTemplate(configData.summary || configData.description, configData)}. ${configData.scenery ? interpolateTemplate(configData.scenery, configData) + '.' : ''} ${expandedSubject}. ${expandedTime}. ${expandedStyle}. ${expandedTones ? 'Atmosphere is ' + expandedTones + '.' : ''} ${activeElements ? 'Featuring ' + activeElements + '.' : ''} ${expandedPlacement} ${expandedFont}. ${expandedGoals}. ${interpolateTemplate(configData.customAdditions, configData)}. ${(configData.keywords || []).join(', ')}`.replace(/\s+/g, ' ').trim();

        if (engine?.provider === 'midjourney') {
          results[context] = `${baseDesc} --ar ${configData.primaryRatio} --style raw --v 6.0`;
        } else if (engine?.provider === 'google' || engine?.provider === 'openai') {
          results[context] = `Write a highly detailed and evocative image generation prompt describing the following scene:\n\n${baseDesc}\n\nEnsure it is vivid, cinematic, and tailored for an AI image generator to produce a stunning, high-quality result.`;
        } else {
          results[context] = `/generate prompt: ${baseDesc}`;
        }
      } else if (context === 'Twitter/X Post') {
        results[context] = `🎮 ${configData.title}\n\n${interpolateTemplate(configData.summary || configData.description, configData)}\n\n${expandedSubject} ${expandedTime}.\n\n${activeElements ? 'Highlighting: ' + activeElements : ''}\n\n${hashtags}`.trim();
      } else if (context === 'Instagram Caption') {
        results[context] = `✨ ${configData.title}\n\n${interpolateTemplate(configData.summary || configData.description, configData)}\n\nCaptured in ${subjectName}. ${expandedSubject}. ${expandedTime}.\n\n${activeElements ? 'Featuring: ' + activeElements : ''}\n\n📸 Let me know what you think below!\n\n${hashtags}`.trim();
      } else {
        results[context] = `📝 ${configData.title}\n\n${interpolateTemplate(configData.summary || configData.description, configData)}\n\n${expandedSubject}\n\n${hashtags}`.trim();
      }
    });

    return results;
  };

  useEffect(() => {
    if (!appData) return;
    setIsCompiling(true);
    const delay = setTimeout(() => {
      const compiled = compileOutput(config);
      setCompiledOutputs(compiled);
      setIsCompiling(false);
    }, 1700);

    return () => clearTimeout(delay);
  }, [config, appData]);

  const handleManualCompile = () => {
    if (!appData) return;
    setIsCompiling(false);
    const compiled = compileOutput(config);
    setCompiledOutputs(compiled);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (!appData) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#131314] text-indigo-500"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const subjectOptions = appData.subjects.map((s: any) => ({ value: s.id, label: s.name }));

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-50 dark:bg-[#131314] text-slate-800 dark:text-slate-200">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredPrompts={savedPrompts}
        currentConfigId={config.id}
        onSelectConfig={setConfig}
        onNewConfig={() => setConfig({ ...DEFAULT_CONFIG, id: Date.now().toString(), title: 'New Configuration' })}
        onSave={handleSave}
        availableGames={subjectOptions}
      />

      {isMobile && (
        <div className="flex bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-[#333] z-10">
          <button onClick={() => setMobileActiveTab('form')} className={`flex-1 py-3 text-sm font-semibold ${mobileActiveTab === 'form' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>Configuration</button>
          <button onClick={() => setMobileActiveTab('output')} className={`flex-1 py-3 text-sm font-semibold ${mobileActiveTab === 'output' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>Final Output</button>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden relative">
        <div
          className="h-full overflow-y-auto custom-scrollbar pb-20"
          style={{ width: isMobile ? '100%' : `${leftWidthPct}%`, display: isMobile && mobileActiveTab !== 'form' ? 'none' : 'block' }}
        >
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <div className="border-b border-gray-200 dark:border-[#2a2a2a] pb-4">
              <input name="title" value={config.title} onChange={handleInputChange} className="w-full bg-transparent text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 focus:outline-none" placeholder="Config Title" />
            </div>

            <div className="sticky top-0 z-30 bg-gray-50/95 dark:bg-[#131314]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#2a2a2a] py-3 -mx-4 md:-mx-8 px-4 md:px-8 mb-6 transition-all shadow-sm">
              <div className="max-w-4xl mx-auto space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                    Variables Toolbar (Drag/drop to editor or click to insert)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'subjectId', label: 'Subject' },
                    { name: 'goal', label: 'Goal' },
                    { name: 'timeOfDay', label: 'Time of Day' },
                    { name: 'imageStyle', label: 'Image Style' },
                    { name: 'fontStyle', label: 'Font Style' },
                    { name: 'textPlacements', label: 'Text Placement' },
                    { name: 'scenery', label: 'Scenery' },
                    { name: 'tone', label: 'Tones' },
                    { name: 'platform', label: 'Platforms' },
                    { name: 'keywords', label: 'Keywords' },
                  ].map((variable) => {
                    let val = '';
                    if (variable.name === 'tone') {
                      val = Array.isArray(config.tone) ? config.tone.join(', ') : '';
                    } else if (variable.name === 'platform') {
                      val = Array.isArray(config.platform) ? config.platform.join(' and ') : '';
                    } else {
                      val = (config as any)[variable.name] || '';
                    }
                    return (
                      <button
                        key={variable.name}
                        type="button"
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", `{{${variable.name}}}`);
                          e.dataTransfer.effectAllowed = "copy";
                        }}
                        onClick={() => insertVariable(`{{${variable.name}}}`)}
                        className="px-2.5 py-1 text-[10px] bg-white dark:bg-[#1e1e1f] hover:bg-indigo-50 dark:hover:bg-[#25252b] text-indigo-600 dark:text-indigo-400 rounded-md border border-gray-200 dark:border-[#2f2f35] font-mono transition-all flex items-center gap-1 active:scale-95 cursor-grab active:cursor-grabbing hover:shadow-sm hover:border-indigo-300 dark:hover:border-indigo-900 group"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${VARIABLE_COLORS[variable.name] || 'bg-indigo-500'} mr-1`}></span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{`{{${variable.name}}}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest border-b border-gray-200 dark:border-[#333] pb-2 flex items-center justify-between">
                  <span>Core Idea</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleEnhanceSubject}
                      disabled={!hasAIKey || isEnhancing || isMagicFilling}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Stop
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Expand Idea
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleMagicFill}
                      disabled={!hasAIKey || isEnhancing || isMagicFilling}
                      className="px-3 py-1 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isMagicFilling ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Stop
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5" /> Magic Fill Form
                        </>
                      )}
                    </button>
                  </div>
                </label>
                <textarea
                  name="description" value={config.description} onChange={handleInputChange} rows={3}
                  onFocus={() => setLastFocusedInput('description')}
                  className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 outline-none resize-none transition-all focus:border-indigo-500"
                  placeholder="Describe the central character or action... Click Expand or Magic Fill."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                    <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.subjectId} mr-2 shadow-sm`}></span>
                    Subject / Universe
                  </label>
                  <div className="mb-2"><SubjectVisualizer value={config.subjectId} onChange={(val) => setConfig(prev => ({ ...prev, subjectId: val }))} subjects={appData.subjects.map((s: any) => ({ id: s.id, name: s.name }))} /></div>
                  <Combobox label="Subject / Universe (Fallback)" name="subjectId" value={config.subjectId} onChange={handleInputChange} options={subjectOptions} placeholder="e.g. elden-ring" colorCode={VARIABLE_COLORS.subjectId} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                    <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.goal} mr-2 shadow-sm`}></span>
                    Goal / Objective
                  </label>
                  <div className="mb-2"><GoalVisualizer values={config.goal || []} onChange={(val) => setConfig(prev => ({ ...prev, goal: val }))} availableGoals={Object.keys(appData.global.dictionaries.goal)} /></div>
                  <MultiSelect label="Goal / Objective (Fallback)" values={config.goal || []} onChange={(v) => setConfig(prev => ({ ...prev, goal: v }))} suggestions={Object.keys(appData.global.dictionaries.goal)} colorCode={VARIABLE_COLORS.goal} />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest border-b border-gray-200 dark:border-[#333] pb-2">Environment & Vibe</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                    <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.timeOfDay} mr-2 shadow-sm`}></span>
                    Time of Day
                  </label>
                  <div className="mb-2"><TimeOfDayVisualizer value={config.timeOfDay} onChange={(val) => setConfig(prev => ({ ...prev, timeOfDay: val }))} timesOptions={Object.keys(appData.global.dictionaries.timeOfDay)} /></div>
                  <Combobox label="Time of Day (Fallback)" name="timeOfDay" value={config.timeOfDay} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.timeOfDay)} placeholder="e.g. Golden Hour" colorCode={VARIABLE_COLORS.timeOfDay} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                    <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.imageStyle} mr-2 shadow-sm`}></span>
                    Image Style
                  </label>
                  <div className="mb-2"><ImageStyleGrid value={config.imageStyle} onChange={(val) => setConfig(prev => ({ ...prev, imageStyle: val }))} styles={Object.keys(appData.global.dictionaries.imageStyle)} /></div>
                  <Combobox label="Image Style (Fallback)" name="imageStyle" value={config.imageStyle} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.imageStyle)} placeholder="e.g. Cinematic 3D" colorCode={VARIABLE_COLORS.imageStyle} />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest border-b border-gray-200 dark:border-[#333] pb-2 flex items-center">
                <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.additionalElements} mr-2 shadow-sm`}></span>
                Additional Elements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                    <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.tone} mr-2 shadow-sm`}></span>
                    Tones & Mood
                  </label>
                  <div className="mb-2"><ToneVisualizer values={config.tone || []} onChange={(v) => setConfig(prev => ({ ...prev, tone: v }))} availableTones={Object.keys(appData.global.dictionaries.tone)} /></div>
                  <MultiSelect label="Tones & Mood (Fallback)" values={config.tone} onChange={(v) => setConfig(prev => ({ ...prev, tone: v }))} suggestions={Object.keys(appData.global.dictionaries.tone).concat(Object.keys(appData.macros.tones))} tagSets={appData.macros.tones} iconMap={TONE_ICONS} colorCode={VARIABLE_COLORS.tone} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                    <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.platform} mr-2 shadow-sm`}></span>
                    Platforms
                  </label>
                  <div className="mb-2"><PlatformVisualizer values={config.platform || []} onChange={(v) => setConfig(prev => ({ ...prev, platform: v }))} platforms={['YouTube', 'YouTube Shorts', 'Instagram', 'Twitter / X', 'TikTok']} /></div>
                  <MultiSelect label="Platforms (Fallback)" values={config.platform || []} onChange={(v) => setConfig(prev => ({ ...prev, platform: v }))} suggestions={['YouTube', 'YouTube Shorts', 'Instagram', 'Twitter / X', 'TikTok']} colorCode={VARIABLE_COLORS.platform} />
                </div>
              </div>

              {/* Typography & Layout Section */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest border-b border-gray-200 dark:border-[#333] pb-2">Typography & Layout</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                      <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.textPlacements} mr-2 shadow-sm`}></span>
                      Text Placement / Alignment
                    </label>
                    <div className="mb-2"><TextPlacementGrid value={config.textPlacements} onChange={(val) => setConfig(prev => ({ ...prev, textPlacements: val }))} placements={Object.keys(appData.global.dictionaries.textPlacements)} /></div>
                    <Combobox label="Text Placement / Alignment (Fallback)" name="textPlacements" value={config.textPlacements} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.textPlacements)} placeholder="e.g. Top Left" colorCode={VARIABLE_COLORS.textPlacements} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-400 flex items-center">
                      <span className={`w-2 h-2 rounded-full ${VARIABLE_COLORS.fontStyle} mr-2 shadow-sm`}></span>
                      Font Style Context
                    </label>
                    <div className="mb-2"><FontStyleGrid value={config.fontStyle} onChange={(val) => setConfig(prev => ({ ...prev, fontStyle: val }))} availableStyles={Object.keys(appData.global.dictionaries.fontStyle)} /></div>
                    <Combobox label="Font Style Context (Fallback)" name="fontStyle" value={config.fontStyle} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.fontStyle)} placeholder="e.g. Bold Serif" colorCode={VARIABLE_COLORS.fontStyle} />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#333]">
                <MultiSelect label="Keywords & Focus" values={config.keywords || []} onChange={(v) => setConfig(prev => ({ ...prev, keywords: v }))} suggestions={Object.keys(appData.global.dictionaries.keywords || {}).concat(Object.keys(appData.macros.keywords || {}))} tagSets={appData.macros.keywords} colorCode={VARIABLE_COLORS.keywords} />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#333]">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center justify-between">
                  Additional Elements
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1">
                  {appData.global.options.elements.concat(Object.keys(appData.macros.elements || {})).map((el: string) => {
                    const isActive = config.additionalElements?.[el];
                    return (
                      <button key={el} onClick={() => handleElementToggle(el)} className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm transition-all border ${isActive ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-400 border-gray-200 dark:border-[#333] hover:border-indigo-500/50'}`}>
                        {isActive && <Check className="w-3.5 h-3.5" />}
                        {el}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-[#2a2a2a]">
              <label className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Prompt Summary</label>
              <textarea
                name="summary"
                value={config.summary || ''}
                onChange={handleInputChange}
                rows={4}
                onFocus={() => setLastFocusedInput('summary')}
                className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl p-3.5 text-sm text-slate-900 dark:text-slate-200 outline-none resize-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="w-1.5 bg-gray-200 dark:bg-[#25252b] hover:bg-indigo-500 cursor-col-resize z-10" onMouseDown={() => setIsDragging(true)} />
        )}

        <div
          className="h-full bg-white dark:bg-[#18181b] flex flex-col border-l border-gray-200 dark:border-[#333]"
          style={{ width: isMobile ? '100%' : `${100 - leftWidthPct}%`, display: isMobile && mobileActiveTab !== 'output' ? 'none' : 'flex' }}
        >
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-[#2a2a2a] flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-[#18181b] flex-none">
            <select name="outputEngineId" value={config.outputEngineId} onChange={handleInputChange} className="bg-white dark:bg-[#25252b] text-sm border border-gray-300 dark:border-[#333] rounded-lg px-3 py-1.5 outline-none">
              {aiEngines.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-[#131314] flex flex-col gap-6">
            {Object.entries(compiledOutputs).map(([contextKey, compiledText]) => {
              const displayOutput = config.compiledOutputOverrides?.[contextKey] ?? compiledText;
              return (
                <div key={contextKey} className="flex flex-col bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl overflow-hidden shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#25252b] flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{contextKey}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleResetOutput(contextKey)} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-[#2d2d33] border border-gray-300 dark:border-[#444] text-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold transition-all">
                        <RotateCcw className="w-3 h-3" /> <span>Reset</span>
                      </button>
                      <button
                        onClick={() => handleEnhanceOutput(contextKey)}
                        disabled={!hasAIKey || (isEnhancingOutput !== null && isEnhancingOutput !== contextKey) || !displayOutput}
                        className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded text-[10px] font-semibold transition-all disabled:opacity-50"
                      >
                        {isEnhancingOutput === contextKey ? <><Loader2 className="w-3 h-3 animate-spin" /> Stop</> : <><Sparkles className="w-3 h-3" /> Enhance</>}
                      </button>
                      <button onClick={() => copyToClipboard(displayOutput, contextKey)} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all ${copied === contextKey ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                        {copied === contextKey ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied === contextKey ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="w-full bg-transparent p-4 text-sm text-slate-800 dark:text-slate-300 leading-relaxed outline-none resize-none focus:ring-0 font-mono"
                    rows={6}
                    value={displayOutput}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      compiledOutputOverrides: { ...(prev.compiledOutputOverrides || {}), [contextKey]: e.target.value } 
                    }))}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
