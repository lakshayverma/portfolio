"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Sparkles, Copy, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
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
  customAdditions: ''
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
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);

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
                    description: t.description,
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

${interpolateTemplate(config.description, config)}

We are diving deep into ${subjectName} today. ${expandedSubject}. The vibe is ${config.tone?.join(', ') || 'epic'} as our primary objective is: ${config.goal}. 

${config.scenery ? 'Current Location: ' + interpolateTemplate(config.scenery, config) : ''}
${activeElements ? 'Things to look out for: ' + activeElements : ''}

${interpolateTemplate(config.customAdditions, config)}

${hashtags}`.trim();
    }

    if (context === 'Image Prompt') {
      const baseDesc = `${interpolateTemplate(config.description, config)}. ${config.scenery ? interpolateTemplate(config.scenery, config) + '.' : ''} ${expandedSubject}. ${expandedTime}. ${expandedStyle}. ${expandedTones ? 'Atmosphere is ' + expandedTones + '.' : ''} ${activeElements ? 'Featuring ' + activeElements + '.' : ''} ${expandedPlacement} ${expandedFont}. ${expandedGoal}. ${interpolateTemplate(config.customAdditions, config)}. ${(config.keywords || []).join(', ')}`.replace(/\s+/g, ' ').trim();
      
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
      return `🎮 ${config.title}\n\n${interpolateTemplate(config.description, config)}\n\n${expandedSubject} ${expandedTime}.\n\n${activeElements ? 'Highlighting: ' + activeElements : ''}\n\n${hashtags}`.trim();
    }

    if (context === 'Instagram Caption') {
      return `✨ ${config.title}\n\n${interpolateTemplate(config.description, config)}\n\nCaptured in ${subjectName}. ${expandedSubject}. ${expandedTime}.\n\n${activeElements ? 'Featuring: ' + activeElements : ''}\n\n📸 Let me know what you think below!\n\n${hashtags}`.trim();
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

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Combobox label="Subject / Universe" name="subjectId" value={config.subjectId} onChange={handleInputChange} options={subjectOptions} placeholder="e.g. elden-ring" />
                <Combobox label="Goal / Objective" name="goal" value={config.goal} onChange={handleInputChange} options={Object.keys(appData.global.dictionaries.goal)} placeholder="e.g. High CTR" />
              </div>
              <div className="space-y-2 relative">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-400">Core Subject (Supports {'{{variables}}'})</label>
                  <button 
                    onClick={handleEnhanceSubject}
                    disabled={isEnhancing || !config.description}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-3 py-1.5 rounded shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all"
                  >
                    {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Enhance
                  </button>
                </div>
                <textarea 
                  name="description" value={config.description} onChange={handleInputChange} rows={3} 
                  className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 outline-none resize-none focus:border-indigo-500 transition-colors" 
                  placeholder="Describe the central character or action... Click Enhance to expand it."
                />
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
            
            <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}>
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
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
