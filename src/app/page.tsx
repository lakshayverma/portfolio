"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Sparkles, Copy, CheckCircle2, SplitSquareHorizontal, RotateCcw, Undo2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Combobox } from '@/components/Combobox';
import { MultiSelect } from '@/components/MultiSelect';
import { AspectRatioVisualizer } from '@/components/Visualizers/AspectRatioVisualizer';
import { TextPlacementGrid } from '@/components/Visualizers/TextPlacementGrid';
import { ImageStyleGrid } from '@/components/Visualizers/ImageStyleGrid';
import { TimeOfDayVisualizer } from '@/components/Visualizers/TimeOfDayVisualizer';
import { PromptConfig, getAllFromDB, saveToDB } from '@/services/db';
import { fetchGemini } from '@/services/gemini';
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
  subjectId: '',
  goal: '',
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

export default function Page() {
  const [appData, setAppData] = useState<any>(null);
  const [config, setConfig] = useState<PromptConfig>({ ...DEFAULT_CONFIG, id: Date.now().toString() });
  const [savedPrompts, setSavedPrompts] = useState<PromptConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [leftWidthPct, setLeftWidthPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'form' | 'output'>('form');

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  const [isEnhancingOutput, setIsEnhancingOutput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDraggingOverSummary, setIsDraggingOverSummary] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Load local storage split pref
    const savedSplit = localStorage.getItem('thumbnailAppSplitNext');
    if (savedSplit) setLeftWidthPct(parseFloat(savedSplit));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Fetch API Data
        const res = await fetch('/api/config');
        const data = await res.json();
        setAppData(data);

        // Fetch IndexedDB Data
        let savedData = await getAllFromDB();
        
        // If empty DB, populate with some templates from API
        if (savedData.length === 0 && data.subjects) {
          const templates: PromptConfig[] = [];
          data.subjects.forEach((subj: any) => {
            if (subj.templates) {
              subj.templates.forEach((t: any, i: number) => {
                if (typeof t === 'string') {
                  templates.push({
                    ...DEFAULT_CONFIG,
                    id: `template-${subj.id}-${i}`,
                    title: `${subj.name}: ${t.substring(0, 20)}...`,
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
                    tone: t.tone || [],
                    imageStyle: t.imageStyle || '',
                    goal: t.goal || '',
                    primaryRatio: t.primaryRatio || '16:9',
                    additionalElements: addElements
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!config.description) return;
    setIsEnhancing(true);
    try {
      const activeSubject = appData?.subjects.find((s: any) => s.id === config.subjectId);
      const subjectName = activeSubject ? activeSubject.name : 'Unknown';
      
      const prompt = `Expand this brief scene idea into a highly vivid, cinematic visual description suitable for an advanced image generation prompt. Focus heavily on dynamic action, lighting, textures, and strong composition. Do NOT return a full prompt, ONLY return the visual description of the subject/action itself. Keep it under 3 punchy sentences.
      Universe: ${subjectName}
      Current Idea: ${config.description}`;
      
      const result = await fetchGemini(prompt, "You are a master art director creating vivid descriptions.");
      if (result) {
        setConfig(prev => ({ ...prev, description: result.trim() }));
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleMagicFill = async () => {
    if (!config.description || !appData) return;
    setIsMagicFilling(true);
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

      const result = await fetchGemini(prompt, "You are a precise JSON configuration generator. Output raw JSON only.");
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
            goal: parsed.goal || prev.goal,
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
    } catch (error) {
      console.error("Magic Fill Error:", error);
      alert("Failed to auto-configure. Please try again or refine your description.");
    } finally {
      setIsMagicFilling(false);
    }
  };

  const handleEnhanceOutput = async () => {
    if (!displayOutput) return;
    setIsEnhancingOutput(true);
    try {
      const context = config.outputContext || 'Image Prompt';
      let prompt = '';
      if (context === 'Image Prompt') {
        prompt = `You are a master digital art director. Take the raw image generation prompt below and enhance it to be extremely vivid, cinematic, and detailed. Add lighting, sensory, texture, and composition details.
        
Rules:
1. Preserve all core content.
2. If there are aspect ratio flags or versions at the end of the prompt (such as "--ar 16:9", "--style raw", "--v 6.0"), you MUST keep them EXACTLY as they are at the very end of your response.
3. Output ONLY the enhanced prompt itself. No quotes, no markdown code blocks, no conversation.

Raw Prompt:
"${displayOutput}"`;
      } else {
        prompt = `You are a professional social media manager. Take the following generated content for ${context} and enhance it to be highly engaging, premium, and well-structured.
        
Rules:
1. Preserve all hashtags and core information.
2. Output ONLY the final enhanced content. No quotes, no markdown blocks, no conversation.

Original Content:
"${displayOutput}"`;
      }

      const result = await fetchGemini(prompt, "You are a master content enhancer. You output ONLY the finalized enhanced text, with no preamble.");
      if (result) {
        setConfig(prev => ({ ...prev, compiledOutputOverride: result.trim() }));
      }
    } catch (error) {
      console.error("Enhance Output Error:", error);
      alert("Failed to enhance the output. Please try again.");
    } finally {
      setIsEnhancingOutput(false);
    }
  };

  const handleResetOutput = () => {
    setConfig(prev => {
      const next = { ...prev };
      delete next.compiledOutputOverride;
      return next;
    });
  };

  const insertVariable = (varStr: string) => {
    const summaryInput = document.getElementsByName('summary')[0] as HTMLTextAreaElement;
    const descInput = document.getElementsByName('description')[0] as HTMLTextAreaElement;
    const input = document.activeElement === descInput ? descInput : (summaryInput || descInput);
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = input.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + varStr + after;
      const fieldName = input.getAttribute('name') as 'summary' | 'description';
      setConfig(prev => ({ ...prev, [fieldName]: newText }));
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + varStr.length, start + varStr.length);
      }, 10);
    }
  };

  const generatedOutput = useMemo(() => {
    if (!appData) return '';
    const context = config.outputContext || 'Image Prompt';
    
    const activeSubject = appData.subjects.find((s: any) => s.id === config.subjectId);
    const subjectName = activeSubject ? activeSubject.name : config.subjectId;
    const subjectDesc = activeSubject ? activeSubject.descriptionTemplate : '';
    
    // Resolve deep templates from API data
    const dicts = appData.global.dictionaries;
    const expandedSubject = subjectDesc ? interpolateTemplate(subjectDesc, config) : `set in ${subjectName}`;
    const expandedTime = resolveDeepTemplate('timeOfDay', config.timeOfDay, 'during', config, dicts);
    const expandedStyle = resolveDeepTemplate('imageStyle', config.imageStyle, 'rendered in a', config, dicts);
    const expandedPlacement = resolveDeepTemplate('textPlacements', config.textPlacements, 'leave space at', config, dicts);
    const expandedFont = resolveDeepTemplate('fontStyle', config.fontStyle, 'for', config, dicts);
    const expandedGoal = resolveDeepTemplate('goal', config.goal, 'aiming for', config, dicts);
    
    const expandedTones = (config.tone || []).map(t => resolveDeepTemplate('tone', t, 'feeling', config, dicts)).join(' and ');
    const activeElementsList = Object.entries(config.additionalElements || {}).filter(([_, v]) => v).map(([k]) => k);
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

    const hashtags = [...new Set([subjectName.replace(/\s+/g, ''), ...(config.keywords || []).map(k => k.replace(/[\s@]+/g, ''))])]
      .filter(Boolean).map(t => `#${t}`).join(' ');

    if (context === 'YouTube Description') {
      return `🔥 ${config.title} | ${subjectName}

${interpolateTemplate(config.summary || config.description, config)}

We are diving deep into ${subjectName} today. ${expandedSubject}. The vibe is ${config.tone?.join(', ') || 'epic'} as our primary objective is: ${config.goal}. 

${config.scenery ? 'Current Location: ' + interpolateTemplate(config.scenery, config) : ''}
${activeElements ? 'Things to look out for: ' + activeElements : ''}

${interpolateTemplate(config.customAdditions, config)}

${hashtags}`.trim();
    }

    if (context === 'Image Prompt') {
      const baseDesc = `${interpolateTemplate(config.summary || config.description, config)}. ${config.scenery ? interpolateTemplate(config.scenery, config) + '.' : ''} ${expandedSubject}. ${expandedTime}. ${expandedStyle}. ${expandedTones ? 'Atmosphere is ' + expandedTones + '.' : ''} ${activeElements ? 'Featuring ' + activeElements + '.' : ''} ${expandedPlacement} ${expandedFont}. ${expandedGoal}. ${interpolateTemplate(config.customAdditions, config)}. ${(config.keywords || []).join(', ')}`.replace(/\s+/g, ' ').trim();
      
      if (config.promptSyntax === 'Midjourney') {
        return `${baseDesc} --ar ${config.primaryRatio} --style raw --v 6.0`;
      } else if (config.promptSyntax === 'Gemini' || config.promptSyntax === 'ChatGPT') {
        return `Write a highly detailed and evocative image generation prompt describing the following scene:\n\n${baseDesc}\n\nEnsure it is vivid, cinematic, and tailored for an AI image generator to produce a stunning, high-quality result.`;
      } else {
        // NanoBanana or others
        return `/generate prompt: ${baseDesc}`;
      }
    }

    if (context === 'Twitter/X Post') {
      return `🎮 ${config.title}\n\n${interpolateTemplate(config.summary || config.description, config)}\n\n${expandedSubject} ${expandedTime}.\n\n${activeElements ? 'Highlighting: ' + activeElements : ''}\n\n${hashtags}`.trim();
    }

    if (context === 'Instagram Caption') {
      return `✨ ${config.title}\n\n${interpolateTemplate(config.summary || config.description, config)}\n\nCaptured in ${subjectName}. ${expandedSubject}. ${expandedTime}.\n\n${activeElements ? 'Featuring: ' + activeElements : ''}\n\n📸 Let me know what you think below!\n\n${hashtags}`.trim();
    }

    return 'Select a context';
  }, [config, appData]);

  const displayOutput = config.compiledOutputOverride ?? generatedOutput;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!appData) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#131314] text-indigo-500"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const subjectOptions = appData.subjects.map((s: any) => s.id);

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
        {/* Editor (Left) */}
        <div 
          className="h-full overflow-y-auto custom-scrollbar pb-20" 
          style={{ width: isMobile ? '100%' : `${leftWidthPct}%`, display: isMobile && mobileActiveTab !== 'form' ? 'none' : 'block' }}
        >
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <div className="border-b border-gray-200 dark:border-[#2a2a2a] pb-4">
              <input name="title" value={config.title} onChange={handleInputChange} className="w-full bg-transparent text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 focus:outline-none" placeholder="Config Title" />
            </div>

            {/* Sticky Variables Toolbar */}
            <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-[#131314]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#2a2a2a] py-3 -mx-4 md:-mx-8 px-4 md:px-8 mb-6 transition-all shadow-sm">
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
                  ].map((variable) => {
                    let val = '';
                    if (variable.name === 'tone') {
                      val = Array.isArray(config.tone) ? config.tone.join(', ') : '';
                    } else if (variable.name === 'platform') {
                      val = Array.isArray(config.platform) ? config.platform.join(' and ') : '';
                    } else {
                      val = (config as any)[variable.name] || '';
                    }
                    
                    const displayVal = val ? `"${val}"` : 'empty';

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
                        title={`Drag or click to insert {{${variable.name}}}`}
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{`{{${variable.name}}}`}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-sans italic max-w-[120px] truncate">
                          ({displayVal})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Core Subject (At the top of the form) */}
              <div className="space-y-2 relative">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400">Core Subject (Supports {'{{variables}}'})</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleMagicFill}
                      disabled={isMagicFilling || !config.description}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-white px-3 py-1.5 rounded shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 transition-all"
                    >
                      {isMagicFilling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      Magic Fill
                    </button>
                    <button 
                      onClick={handleEnhanceSubject}
                      disabled={isEnhancing || !config.description}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-3 py-1.5 rounded shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all"
                    >
                      {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Enhance
                    </button>
                  </div>
                </div>
                <textarea 
                  name="description" value={config.description} onChange={handleInputChange} rows={3} 
                  onDragEnter={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    const varText = e.dataTransfer.getData("text/plain");
                    if (varText && varText.startsWith("{{") && varText.endsWith("}}")) {
                      const textarea = e.currentTarget;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const after = text.substring(end, text.length);
                      const newText = before + varText + after;
                      setConfig(prev => ({ ...prev, description: newText }));
                      
                      setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(start + varText.length, start + varText.length);
                      }, 10);
                    }
                  }}
                  className={`w-full bg-white dark:bg-[#1e1e1e] border rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 outline-none resize-none transition-all ${
                    isDraggingOver 
                      ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/10 ring-2 ring-indigo-500/20 scale-[1.01] border-dashed shadow-inner' 
                      : 'border-gray-300 dark:border-[#333] focus:border-indigo-500'
                  }`}
                  placeholder="Describe the central character or action... Click Enhance to expand it or Magic Fill to configure the form."
                />
              </div>

              {/* Subject & Goal (Now below Core Subject) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Combobox label="Subject / Universe" name="subjectId" value={config.subjectId} onChange={handleInputChange} options={subjectOptions} placeholder="e.g. elden-ring" />
                <Combobox label="Goal / Objective" name="goal" value={config.goal} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.goal)} placeholder="e.g. High CTR" />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest border-b border-gray-200 dark:border-[#333] pb-2">Environment & Vibe</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col">
                  <Combobox label="Time of Day" name="timeOfDay" value={config.timeOfDay} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.timeOfDay)} placeholder="e.g. Golden Hour" />
                  <div className="mt-2"><TimeOfDayVisualizer value={config.timeOfDay} onChange={(val) => setConfig(prev => ({...prev, timeOfDay: val}))} timesOptions={Object.keys(appData.global.dictionaries.timeOfDay)} /></div>
                </div>
                
                <div className="space-y-2 flex flex-col">
                  <Combobox label="Image Style" name="imageStyle" value={config.imageStyle} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.imageStyle)} placeholder="e.g. Cinematic 3D" />
                  <div className="mt-2"><ImageStyleGrid value={config.imageStyle} onChange={(val) => setConfig(prev => ({...prev, imageStyle: val}))} styles={Object.keys(appData.global.dictionaries.imageStyle)} /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MultiSelect label="Tones & Mood" values={config.tone} onChange={(v) => setConfig(prev => ({...prev, tone: v}))} suggestions={Object.keys(appData.global.dictionaries.tone).concat(Object.keys(appData.macros.tones))} tagSets={appData.macros.tones} iconMap={TONE_ICONS} />
                <MultiSelect label="Keywords & Tags" values={config.keywords} onChange={(v) => setConfig(prev => ({...prev, keywords: v}))} suggestions={Object.keys(appData.macros.keywords)} tagSets={appData.macros.keywords} />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest border-b border-gray-200 dark:border-[#333] pb-2">Additional Elements</h3>
              <div className="flex flex-wrap gap-2">
                {appData.global.options.elements.concat(Object.keys(appData.macros.elements || {})).map((el: string) => {
                  const Icon = ELEMENT_ICONS[el] || Sparkles;
                  const isActive = config.additionalElements[el];
                  return (
                    <button key={el} onClick={() => handleElementToggle(el)} className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm transition-all border ${isActive ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-400 border-gray-200 dark:border-[#333] hover:border-indigo-500/50'}`}>
                      {Icon && <Icon className="w-4 h-4" />} {el.replace('@', '')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Summary (Final manual pass) */}
            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-[#2a2a2a]">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Prompt Summary (Final manual pass)
                </label>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider hidden sm:inline">
                  Drag & drop variables here or click them
                </span>
              </div>
              <textarea 
                name="summary" 
                value={config.summary || ''} 
                onChange={handleInputChange} 
                rows={4}
                onDragEnter={(e) => { e.preventDefault(); setIsDraggingOverSummary(true); }}
                onDragOver={(e) => { e.preventDefault(); }}
                onDragLeave={() => setIsDraggingOverSummary(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOverSummary(false);
                  const varText = e.dataTransfer.getData("text/plain");
                  if (varText && varText.startsWith("{{") && varText.endsWith("}}")) {
                    const textarea = e.currentTarget;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const before = text.substring(0, start);
                    const after = text.substring(end, text.length);
                    const newText = before + varText + after;
                    setConfig(prev => ({ ...prev, summary: newText }));
                    
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + varText.length, start + varText.length);
                    }, 10);
                  }
                }}
                className={`w-full bg-white dark:bg-[#1e1e1e] border rounded-xl p-3.5 text-sm text-slate-900 dark:text-slate-200 outline-none resize-none transition-all font-mono leading-relaxed ${
                  isDraggingOverSummary 
                    ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/10 ring-2 ring-indigo-500/20 scale-[1.01] border-dashed shadow-inner' 
                    : 'border-gray-300 dark:border-[#333] focus:border-indigo-500 shadow-sm'
                }`}
                placeholder="Weave your variables together here (e.g. 'A warrior in {{subjectId}} exploring under {{timeOfDay}} skies, rendered in {{imageStyle}}.')"
              />
            </div>

          </div>
        </div>

        {/* Resizer */}
        {!isMobile && (
          <div className="w-1.5 bg-gray-200 dark:bg-[#25252b] hover:bg-indigo-500 cursor-col-resize z-10 flex items-center justify-center transition-colors shadow-inner" onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}>
            <SplitSquareHorizontal className="w-3 h-3 text-slate-400 rotate-90" />
          </div>
        )}

        {/* Output (Right) */}
        <div 
          className="h-full bg-white dark:bg-[#18181b] flex flex-col border-l border-gray-200 dark:border-[#333]" 
          style={{ width: isMobile ? '100%' : `${100 - leftWidthPct}%`, display: isMobile && mobileActiveTab !== 'output' ? 'none' : 'flex' }}
        >
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-[#2a2a2a] flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-[#18181b] flex-none">
            <div className="flex gap-4">
              <select name="outputContext" value={config.outputContext} onChange={handleInputChange} className="bg-white dark:bg-[#25252b] text-slate-900 dark:text-slate-200 text-sm border border-gray-300 dark:border-[#333] rounded px-3 py-1.5 outline-none focus:border-indigo-500">
                {appData.global.options.contexts.map((c: string) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select name="promptSyntax" value={config.promptSyntax} onChange={handleInputChange} className="bg-white dark:bg-[#25252b] text-slate-900 dark:text-slate-200 text-sm border border-gray-300 dark:border-[#333] rounded px-3 py-1.5 outline-none focus:border-indigo-500">
                {appData.global.options.syntaxes.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              {config.compiledOutputOverride !== undefined && (
                <button 
                  onClick={handleResetOutput}
                  title="Reset to standard template output"
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#25252b] dark:hover:bg-[#2d2d33] border border-gray-300 dark:border-[#3c3c43] text-slate-700 dark:text-slate-300 rounded text-sm font-semibold transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
              
              <button 
                onClick={handleEnhanceOutput}
                disabled={isEnhancingOutput || !displayOutput}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded text-sm font-semibold transition-all disabled:opacity-50 shadow-md"
              >
                {isEnhancingOutput ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>AI Enhance</span>
              </button>

              <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}>
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-[#131314]">
            <textarea 
              className="w-full h-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl p-4 md:p-6 text-sm md:text-base text-slate-800 dark:text-slate-300 leading-relaxed outline-none resize-none focus:border-indigo-500 transition-colors shadow-inner font-mono"
              value={displayOutput}
              onChange={(e) => setConfig(prev => ({ ...prev, compiledOutputOverride: e.target.value }))}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
