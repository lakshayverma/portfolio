import React, { useState, useEffect } from 'react';
import { X, Save, Server, Key, Bot, Plus, Trash2, Edit2, HelpCircle } from 'lucide-react';
import { getAIConfigs, ProviderConfig } from '@/services/aiProvider';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AISettingsModal({ isOpen, onClose }: Props) {
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftConfig, setDraftConfig] = useState<ProviderConfig | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfigs(getAIConfigs());
      setEditingId(null);
      setDraftConfig(null);
      setShowHelp(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAll = () => {
    localStorage.setItem('ai_configs', JSON.stringify(configs));
    window.dispatchEvent(new Event('ai_config_updated'));
    onClose();
  };

  const handleAddNew = () => {
    setDraftConfig({
      id: `provider-${Date.now()}`,
      name: 'New Provider',
      type: 'text-llm',
      provider: 'google',
      apiKey: '',
      baseUrl: '',
      modelName: ''
    });
    setEditingId('new');
  };

  const handleEdit = (config: ProviderConfig) => {
    setDraftConfig({ ...config });
    setEditingId(config.id);
  };

  const handleDelete = (id: string) => {
    setConfigs(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveDraft = () => {
    if (!draftConfig) return;
    if (editingId === 'new') {
      setConfigs(prev => [...prev, draftConfig]);
    } else {
      setConfigs(prev => prev.map(c => c.id === editingId ? draftConfig : c));
    }
    setEditingId(null);
    setDraftConfig(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-gray-50 dark:bg-[#25252b] flex-shrink-0">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-500" />
            AI Providers & Engines
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHelp(!showHelp)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${showHelp ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-slate-500 hover:bg-gray-200 dark:hover:bg-[#333]'}`}>
              <HelpCircle className="w-4 h-4" /> Help & Setup
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-gray-200 dark:hover:bg-[#333] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Help Panel (Slide in from right or take half width) */}
          {showHelp && (
            <div className="w-64 border-r border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#131314] overflow-y-auto custom-scrollbar p-4 flex-shrink-0">
              <h3 className="font-semibold text-sm mb-4 text-slate-800 dark:text-slate-200 border-b border-gray-200 dark:border-[#333] pb-2">Configuration Guide</h3>
              
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Local Custom API (Ollama / LM Studio)</h4>
                  <p className="mt-1">For Ollama: Use <code className="bg-gray-200 dark:bg-[#333] px-1 py-0.5 rounded text-[10px]">http://localhost:11434/v1</code></p>
                  <p className="mt-1">For LM Studio: Use <code className="bg-gray-200 dark:bg-[#333] px-1 py-0.5 rounded text-[10px]">http://localhost:1234/v1</code></p>
                  <p className="mt-1 text-[10px] italic">No API key required for local models.</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Google Gemini</h4>
                  <p className="mt-1">Requires an API Key from Google AI Studio. Leave blank to use the developer's default key if provided.</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">OpenAI (ChatGPT)</h4>
                  <p className="mt-1">Requires a valid OpenAI API key. Ensure you specify the exact model name (e.g., <code className="bg-gray-200 dark:bg-[#333] px-1 py-0.5 rounded text-[10px]">gpt-4o</code>).</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Image Engines</h4>
                  <p className="mt-1">Midjourney or Nano-Banana formats are purely syntactical; they do not perform generation directly in this UI.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {!editingId ? (
            <div className="space-y-4">
              {configs.map(config => (
                <div key={config.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-[#333] rounded-lg bg-gray-50/50 dark:bg-[#25252b]/50">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">{config.name}</div>
                    <div className="text-xs text-slate-500 flex gap-2">
                      <span className="uppercase">{config.provider}</span>
                      <span>&bull;</span>
                      <span>{config.type === 'text-llm' ? 'Text Assistant' : 'Image Engine'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(config)} className="p-1.5 text-slate-400 hover:text-indigo-500 bg-white dark:bg-[#1e1e1e] rounded border border-gray-200 dark:border-[#333]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(config.id)} className="p-1.5 text-slate-400 hover:text-rose-500 bg-white dark:bg-[#1e1e1e] rounded border border-gray-200 dark:border-[#333]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={handleAddNew} className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-[#444] text-slate-500 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all font-medium text-sm">
                <Plus className="w-4 h-4" /> Add Provider
              </button>
            </div>
          ) : draftConfig ? (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#333] pb-2">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {editingId === 'new' ? 'Add New Provider' : 'Edit Provider'}
                </h3>
                <button onClick={() => setEditingId(null)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Back to list</button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                  <input
                    type="text"
                    value={draftConfig.name}
                    onChange={(e) => setDraftConfig({ ...draftConfig, name: e.target.value })}
                    placeholder="e.g. My ChatGPT, Local Llama"
                    className="w-full bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                    <select
                      value={draftConfig.type}
                      onChange={(e) => setDraftConfig({ ...draftConfig, type: e.target.value as any })}
                      className="w-full bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="text-llm">Text Assistant (LLM)</option>
                      <option value="image-engine">Image Engine</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Provider Backend</label>
                    <select
                      value={draftConfig.provider}
                      onChange={(e) => setDraftConfig({ ...draftConfig, provider: e.target.value as any })}
                      className="w-full bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="google">Google Gemini</option>
                      <option value="openai">OpenAI</option>
                      <option value="custom">Local/Custom API</option>
                      {draftConfig.type === 'image-engine' && (
                        <>
                          <option value="midjourney">Midjourney</option>
                          <option value="nano-banana">Nano-Banana</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-slate-400" /> API Key
                  </label>
                  <input
                    type="password"
                    value={draftConfig.apiKey}
                    onChange={(e) => setDraftConfig({ ...draftConfig, apiKey: e.target.value })}
                    placeholder={draftConfig.provider === 'custom' ? "Optional for local models" : "Enter your API key"}
                    className="w-full bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  {draftConfig.provider === 'google' && (
                    <p className="text-[10px] text-slate-500">Leave blank to use default if provided.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-slate-400" /> Base URL
                  </label>
                  <input
                    type="text"
                    value={draftConfig.baseUrl || ''}
                    onChange={(e) => setDraftConfig({ ...draftConfig, baseUrl: e.target.value })}
                    disabled={draftConfig.provider !== 'custom'}
                    placeholder={draftConfig.provider === 'custom' ? "http://localhost:11434/v1" : "Default"}
                    className="w-full bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-slate-400" /> Model Name
                  </label>
                  <input
                    type="text"
                    value={draftConfig.modelName || ''}
                    onChange={(e) => setDraftConfig({ ...draftConfig, modelName: e.target.value })}
                    placeholder="e.g. gpt-4o, llama3"
                    className="w-full bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <button onClick={handleSaveDraft} className="w-full py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                  Done Editing
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-[#333] flex justify-end gap-3 bg-gray-50 dark:bg-[#25252b] flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSaveAll} disabled={!!editingId} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-indigo-600">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
