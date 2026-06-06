"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Layers, Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Copy, 
  Save, Type, Image as ImageIcon, Palette, Sparkles, ExternalLink, 
  Grid, Monitor, Play, Sliders, CheckCircle2, ArrowLeft, Loader2, Move,
  Undo, Redo, RefreshCw, Download, Upload
} from 'lucide-react';
import Link from 'next/link';

interface OBSLayer {
  id: string;
  name: string;
  type: 'text' | 'color' | 'gradient' | 'animated-gradient' | 'image' | 'countdown';
  visible: boolean;
  opacity: number;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  
  // Text configs
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textPlacement?: string;
  fontWeight?: string;
  fontStyle?: string;
  textTransform?: string;
  letterSpacing?: number;
  
  // Glow / Shadow Configs
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffset?: { x: number; y: number };
  outerGlowColor?: string;
  outerGlowBlur?: number;
  innerGlowColor?: string;
  innerGlowBlur?: number;

  // Solid background configurations
  bgColor?: string;

  // Gradient configurations
  gradientType?: 'linear' | 'radial';
  gradientAngle?: number;
  gradientColors?: string[];
  gradientStops?: number[];

  // Animated gradient configurations
  animationSpeed?: number;
  animationType?: 'shift' | 'rotate' | 'wave';
  animationTimingFunction?: string;

  // Image configurations
  imageUrl?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';

  // Corner radius & borders
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderOpacity?: number;
  bgOpacity?: number;
  borderType?: 'inside' | 'outside';
  padding?: number;

  // Box Shadow spreading & inset configs
  shadowSpread?: number;
  shadowInset?: boolean;

  // URL query parameter fetching
  fetchFromQuery?: boolean;
  queryParamName?: string;

  // Countdown timer config
  countdownDuration?: number;
}

interface OBSScene {
  id: string;
  title: string;
  description: string;
  width: number;
  height: number;
  layers: OBSLayer[];
}

const FACTORY_TEMPLATES: Record<string, OBSLayer[]> = {
  "gaming-hud": [
    {
      "id": "animated-header-bg",
      "name": "Top Bar Animated Flow",
      "type": "animated-gradient",
      "visible": true,
      "opacity": 0.9,
      "top": 0,
      "left": 0,
      "width": 100,
      "height": 5,
      "zIndex": 1,
      "gradientType": "linear",
      "gradientAngle": 90,
      "gradientColors": ["#ec4899", "#8b5cf6", "#3b82f6"],
      "animationSpeed": 6,
      "animationType": "shift"
    },
    {
      "id": "header-title-text",
      "name": "Stream Alert Text",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 0.5,
      "left": 5,
      "width": 90,
      "height": 4,
      "zIndex": 5,
      "text": "🔴 MATCH IN PROGRESS | NEXT GOAL: 500 SUBS",
      "fontFamily": "Orbitron",
      "fontSize": 18,
      "color": "#ffffff",
      "textPlacement": "center-left",
      "fontWeight": "bold",
      "fontStyle": "normal",
      "textTransform": "uppercase",
      "letterSpacing": 2,
      "shadowColor": "#000000",
      "shadowBlur": 4,
      "shadowOffset": { "x": 2, "y": 2 },
      "outerGlowColor": "#ec4899",
      "outerGlowBlur": 8
    },
    {
      "id": "webcam-border",
      "name": "Webcam Gradient Border",
      "type": "gradient",
      "visible": true,
      "opacity": 0.85,
      "top": 15,
      "left": 75,
      "width": 22,
      "height": 22,
      "zIndex": 2,
      "gradientType": "linear",
      "gradientAngle": 135,
      "gradientColors": ["#ec4899", "#8b5cf6"],
      "bgColor": "#ffffff"
    },
    {
      "id": "webcam-cutout",
      "name": "Webcam Inner Frame",
      "type": "color",
      "visible": true,
      "opacity": 1,
      "top": 15.5,
      "left": 75.3,
      "width": 21.4,
      "height": 21,
      "zIndex": 3,
      "bgColor": "#131314"
    },
    {
      "id": "webcam-label-glow",
      "name": "Webcam Banner Label",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 33.5,
      "left": 75,
      "width": 22,
      "height": 3,
      "zIndex": 4,
      "text": "LAKSHAY LIVE",
      "fontFamily": "Impact",
      "fontSize": 14,
      "color": "#ffffff",
      "textPlacement": "center",
      "fontWeight": "bold",
      "fontStyle": "normal",
      "textTransform": "uppercase",
      "letterSpacing": 3,
      "outerGlowColor": "#8b5cf6",
      "outerGlowBlur": 10
    }
  ],
  "podcast-badge": [
    {
      "id": "badge-base",
      "name": "Glass Base Panel",
      "type": "gradient",
      "visible": true,
      "opacity": 0.8,
      "top": 78,
      "left": 6,
      "width": 30,
      "height": 12,
      "zIndex": 1,
      "gradientType": "linear",
      "gradientAngle": 90,
      "gradientColors": ["rgba(30, 30, 30, 0.85)", "rgba(15, 15, 15, 0.95)"]
    },
    {
      "id": "badge-border-accent",
      "name": "Left Accent Stripe",
      "type": "color",
      "visible": true,
      "opacity": 0.95,
      "top": 78,
      "left": 5.7,
      "width": 0.3,
      "height": 12,
      "zIndex": 2,
      "bgColor": "#6366f1"
    },
    {
      "id": "badge-name",
      "name": "Speaker Name Text",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 79.5,
      "left": 7.5,
      "width": 27,
      "height": 5,
      "zIndex": 3,
      "text": "Dr. Helena Carter",
      "fontFamily": "Montserrat",
      "fontSize": 32,
      "color": "#ffffff",
      "textPlacement": "center-left",
      "fontWeight": "700",
      "fontStyle": "normal",
      "textTransform": "none",
      "letterSpacing": 1,
      "shadowColor": "#000000",
      "shadowBlur": 4,
      "shadowOffset": { "x": 1, "y": 1 }
    },
    {
      "id": "badge-title",
      "name": "Speaker Subtitle Text",
      "type": "text",
      "visible": true,
      "opacity": 0.9,
      "top": 84.5,
      "left": 7.5,
      "width": 27,
      "height": 4,
      "zIndex": 4,
      "text": "Director of Deep Learning Research",
      "fontFamily": "Inter",
      "fontSize": 16,
      "color": "#a5b4fc",
      "textPlacement": "center-left",
      "fontWeight": "400",
      "fontStyle": "italic",
      "textTransform": "none",
      "letterSpacing": 0.5,
      "outerGlowColor": "rgba(99, 102, 241, 0.2)",
      "outerGlowBlur": 5
    }
  ],
  "animated-welcome": [
    {
      "id": "fullscreen-animated-gradient",
      "name": "Fluid Animated Gradient",
      "type": "animated-gradient",
      "visible": true,
      "opacity": 1,
      "top": 0,
      "left": 0,
      "width": 100,
      "height": 100,
      "zIndex": 1,
      "gradientType": "linear",
      "gradientAngle": 45,
      "gradientColors": ["#1e1b4b", "#311042", "#0f172a", "#1e1b4b"],
      "animationSpeed": 10,
      "animationType": "shift"
    },
    {
      "id": "welcome-large-text",
      "name": "Main Welcome Text",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 35,
      "left": 10,
      "width": 80,
      "height": 15,
      "zIndex": 2,
      "text": "STREAM STARTING SOON",
      "fontFamily": "Orbitron",
      "fontSize": 56,
      "color": "#ffffff",
      "textPlacement": "center",
      "fontWeight": "900",
      "fontStyle": "normal",
      "textTransform": "uppercase",
      "letterSpacing": 8,
      "shadowColor": "#000000",
      "shadowBlur": 15,
      "shadowOffset": { "x": 0, "y": 4 },
      "outerGlowColor": "#ec4899",
      "outerGlowBlur": 20
    },
    {
      "id": "subtext-countdown",
      "name": "Subtext / Prompt Message",
      "type": "text",
      "visible": true,
      "opacity": 0.8,
      "top": 52,
      "left": 20,
      "width": 60,
      "height": 8,
      "zIndex": 3,
      "text": "Grab some popcorn. We're launching in just a moment...",
      "fontFamily": "Inter",
      "fontSize": 20,
      "color": "#cbd5e1",
      "textPlacement": "center",
      "fontWeight": "400",
      "fontStyle": "normal",
      "textTransform": "none",
      "letterSpacing": 1
    }
  ],
  "esports-scoreboard": [
    {
      "id": "scoreboard-bg",
      "name": "Base Glass Panel",
      "type": "gradient",
      "visible": true,
      "opacity": 0.85,
      "top": 2,
      "left": 30,
      "width": 40,
      "height": 7,
      "zIndex": 1,
      "gradientType": "linear",
      "gradientAngle": 90,
      "gradientColors": ["rgba(15, 23, 42, 0.9)", "rgba(8, 8, 12, 0.95)"]
    },
    {
      "id": "timer-indicator-bg",
      "name": "Center Timer Panel",
      "type": "color",
      "visible": true,
      "opacity": 0.95,
      "top": 2,
      "left": 47.5,
      "width": 5,
      "height": 7,
      "zIndex": 2,
      "bgColor": "#ec4899"
    },
    {
      "id": "team-a-name",
      "name": "Team A Label",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 2.5,
      "left": 31,
      "width": 12,
      "height": 6,
      "zIndex": 3,
      "text": "ANTIGRAVITY",
      "fontFamily": "Orbitron",
      "fontSize": 20,
      "color": "#60a5fa",
      "textPlacement": "center-left",
      "fontWeight": "bold"
    },
    {
      "id": "team-b-name",
      "name": "Team B Label",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 2.5,
      "left": 57,
      "width": 12,
      "height": 6,
      "zIndex": 3,
      "text": "DEEPMIND FC",
      "fontFamily": "Orbitron",
      "fontSize": 20,
      "color": "#f87171",
      "textPlacement": "center-right",
      "fontWeight": "bold"
    },
    {
      "id": "scoreboard-score",
      "name": "Match Score Text",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 2,
      "left": 43,
      "width": 14,
      "height": 7,
      "zIndex": 4,
      "text": "3   -   2",
      "fontFamily": "Impact",
      "fontSize": 28,
      "color": "#ffffff",
      "textPlacement": "center",
      "shadowColor": "#000000",
      "shadowBlur": 4
    },
    {
      "id": "round-timer",
      "name": "Timer Text",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 2,
      "left": 47.5,
      "width": 5,
      "height": 7,
      "zIndex": 4,
      "text": "14:35",
      "fontFamily": "Bebas Neue",
      "fontSize": 22,
      "color": "#ffffff",
      "textPlacement": "center"
    }
  ],
  "webcam-chat-overlay": [
    {
      "id": "chat-box-glass",
      "name": "Chat Glass panel",
      "type": "color",
      "visible": true,
      "opacity": 0.65,
      "top": 15,
      "left": 4,
      "width": 24,
      "height": 70,
      "zIndex": 1,
      "bgColor": "rgba(20, 20, 24, 0.75)"
    },
    {
      "id": "chat-box-border",
      "name": "Chat Frame Stripe",
      "type": "gradient",
      "visible": true,
      "opacity": 0.9,
      "top": 15,
      "left": 3.7,
      "width": 0.3,
      "height": 70,
      "zIndex": 2,
      "gradientType": "linear",
      "gradientAngle": 180,
      "gradientColors": ["#ec4899", "#8b5cf6"]
    },
    {
      "id": "chat-box-header",
      "name": "Chat Box Header Label",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 16,
      "left": 5,
      "width": 22,
      "height": 4,
      "zIndex": 3,
      "text": "💬 LIVE STREAM CHAT",
      "fontFamily": "Orbitron",
      "fontSize": 16,
      "color": "#ffffff",
      "textPlacement": "center-left",
      "fontWeight": "bold",
      "outerGlowColor": "#8b5cf6",
      "outerGlowBlur": 4
    },
    {
      "id": "webcam-border-br",
      "name": "Webcam Border Frame",
      "type": "gradient",
      "visible": true,
      "opacity": 0.9,
      "top": 60,
      "left": 70,
      "width": 26,
      "height": 30,
      "zIndex": 1,
      "gradientType": "linear",
      "gradientAngle": 45,
      "gradientColors": ["#8b5cf6", "#3b82f6"]
    },
    {
      "id": "webcam-cutout-br",
      "name": "Webcam Cutout Area",
      "type": "color",
      "visible": true,
      "opacity": 1,
      "top": 60.5,
      "left": 70.3,
      "width": 25.4,
      "height": 29,
      "zIndex": 2,
      "bgColor": "#131314"
    },
    {
      "id": "webcam-label-br",
      "name": "Webcam Label",
      "type": "text",
      "visible": true,
      "opacity": 1,
      "top": 57.5,
      "left": 70,
      "width": 26,
      "height": 2.5,
      "zIndex": 3,
      "text": "WEBCAM",
      "fontFamily": "Bebas Neue",
      "fontSize": 16,
      "color": "#3b82f6",
      "textPlacement": "center-left",
      "letterSpacing": 2
    }
  ],
  "vtuber-dream": [
    {
      "id": "vtuber-background-gradient",
      "name": "Dreamscape Ambient Flow",
      "type": "animated-gradient",
      "visible": true,
      "opacity": 0.95,
      "top": 0,
      "left": 0,
      "width": 100,
      "height": 100,
      "zIndex": 1,
      "gradientType": "radial",
      "gradientColors": ["#251535", "#0f081d", "#05020c"],
      "animationSpeed": 15,
      "animationType": "wave"
    },
    {
      "id": "dream-top-overlay-bar",
      "name": "Top Frame Border",
      "type": "animated-gradient",
      "visible": true,
      "opacity": 0.8,
      "top": 0,
      "left": 0,
      "width": 100,
      "height": 1,
      "zIndex": 5,
      "gradientType": "linear",
      "gradientAngle": 90,
      "gradientColors": ["#f472b6", "#c084fc"],
      "animationSpeed": 5,
      "animationType": "shift"
    },
    {
      "id": "ambient-title",
      "name": "Centered Vibe Label",
      "type": "text",
      "visible": true,
      "opacity": 0.9,
      "top": 40,
      "left": 20,
      "width": 60,
      "height": 10,
      "zIndex": 10,
      "text": "✨ RELAX & ENJOY THE VIBES ✨",
      "fontFamily": "Outfit",
      "fontSize": 38,
      "color": "#ffffff",
      "textPlacement": "center",
      "fontWeight": "bold",
      "outerGlowColor": "#c084fc",
      "outerGlowBlur": 15
    },
    {
      "id": "ambient-sub",
      "name": "Ambient Subtext",
      "type": "text",
      "visible": true,
      "opacity": 0.65,
      "top": 51,
      "left": 30,
      "width": 40,
      "height": 5,
      "zIndex": 10,
      "text": "streaming standard ambient visualizer • v1.4",
      "fontFamily": "Inter",
      "fontSize": 14,
      "color": "#e9d5ff",
      "textPlacement": "center",
      "textTransform": "uppercase",
      "letterSpacing": 2
    }
  ]
};


function toRGBA(color: string = '#000000', opacity: number = 1) {
  if (!color) return `rgba(0,0,0,${opacity})`;
  const trimmed = color.trim();
  if (trimmed.startsWith('rgba')) {
    return trimmed.replace(/[\d\.]+\)$/, `${opacity})`);
  }
  if (trimmed.startsWith('rgb')) {
    return trimmed.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  let hex = trimmed.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

interface CountdownTimerProps {
  duration: number;
  style: React.CSSProperties;
  textPlacement?: string;
  className?: string;
}

function CountdownTimer({ duration, style, textPlacement, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    if (secs <= 0) return "00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    
    const pad = (n: number) => String(n).padStart(2, '0');
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  const getPlacementStyles = (placement: string = 'center') => {
    let justifyContent = 'center';
    let alignItems = 'center';
    let textAlign: 'left' | 'center' | 'right' = 'center';

    switch (placement) {
      case 'top-left':
        justifyContent = 'flex-start';
        alignItems = 'flex-start';
        textAlign = 'left';
        break;
      case 'top-center':
        justifyContent = 'center';
        alignItems = 'flex-start';
        textAlign = 'center';
        break;
      case 'top-right':
        justifyContent = 'flex-end';
        alignItems = 'flex-start';
        textAlign = 'right';
        break;
      case 'center-left':
        justifyContent = 'flex-start';
        alignItems = 'center';
        textAlign = 'left';
        break;
      case 'center':
        justifyContent = 'center';
        alignItems = 'center';
        textAlign = 'center';
        break;
      case 'center-right':
        justifyContent = 'flex-end';
        alignItems = 'center';
        textAlign = 'right';
        break;
      case 'bottom-left':
        justifyContent = 'flex-start';
        alignItems = 'flex-end';
        textAlign = 'left';
        break;
      case 'bottom-center':
        justifyContent = 'center';
        alignItems = 'flex-end';
        textAlign = 'center';
        break;
      case 'bottom-right':
        justifyContent = 'flex-end';
        alignItems = 'flex-end';
        textAlign = 'right';
        break;
    }

    return { justifyContent, alignItems, textAlign };
  };

  const { justifyContent, alignItems, textAlign } = getPlacementStyles(textPlacement);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent,
        alignItems
      }}
      className={className}
    >
      <span style={{ ...style, textAlign }}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

const GOOGLE_FONTS_PRESETS = [
  'Inter', 'Orbitron', 'Montserrat', 'Playfair Display', 
  'Impact', 'Bebas Neue', 'Roboto', 'Outfit', 'Cinzel', 
  'Courier New', 'Arial'
];

const QUICK_IMAGE_PRESETS = [
  { name: 'Checker Pattern', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop' },
  { name: 'Neon Stream Border', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
  { name: 'Cyberpunk Grid', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600&auto=format&fit=crop' }
];

export default function OBSEditorPage() {
  const [scenes, setScenes] = useState<OBSScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string>('gaming-hud');
  
  // Multi-select & Advanced interactive states
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const selectedLayerId = selectedLayerIds.length === 1 ? selectedLayerIds[0] : null;
  
  const [history, setHistory] = useState<OBSScene[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [draggedOverId, setDraggedOverId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layerId: string } | null>(null);
  const [alignTarget, setAlignTarget] = useState<'selection' | 'canvas' | 'first-selected' | 'last-selected'>('selection');

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Canvas container reference for mouse coordinate calculations
  const canvasRef = useRef<HTMLDivElement>(null);

  // Fetch all scenes from local storage (with fallback to default templates from server)
  const fetchScenes = async (selectId?: string) => {
    try {
      let data: OBSScene[] = [];
      const localData = localStorage.getItem('obs_scenes');
      if (localData) {
        data = JSON.parse(localData);
      } else {
        const res = await fetch('/api/obs/scenes');
        data = await res.json();
        localStorage.setItem('obs_scenes', JSON.stringify(data));
      }
      setScenes(data);
      if (data.length > 0) {
        setSelectedSceneId(selectId || data[0].id);
      }
      // Populate history queue
      setHistory([JSON.parse(JSON.stringify(data))]);
      setHistoryIndex(0);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch scenes:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes();
  }, []);

  // Selected Scene Computed
  const activeScene = useMemo(() => {
    return scenes.find(s => s.id === selectedSceneId) || null;
  }, [scenes, selectedSceneId]);

  // Selected Layer Computed
  const activeLayer = useMemo(() => {
    if (!activeScene || !selectedLayerId) return null;
    return activeScene.layers.find(l => l.id === selectedLayerId) || null;
  }, [activeScene, selectedLayerId]);

  // Dynamically load Google Fonts inside the editor preview
  useEffect(() => {
    if (!activeScene) return;
    const fonts = activeScene.layers
      .filter(l => l.type === 'text' && l.fontFamily)
      .map(l => l.fontFamily as string);
    
    const uniqueFonts = [...new Set(fonts)];
    if (uniqueFonts.length > 0) {
      const fontQuery = uniqueFonts.map(f => f.replace(/\s+/g, '+')).join('|');
      const linkId = 'editor-google-fonts';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css?family=${fontQuery}:100,200,300,400,500,600,700,800,900,100i,200i,300i,400i,500i,600i,700i,800i,900i&display=swap`;
    }
  }, [activeScene]);

  // Trigger brief alert notifications
  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleContextMenu = (e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setContextMenu({ x, y, layerId });
  };

  // Save the currently active scene to local storage
  const handleSaveScene = async () => {
    if (!activeScene) return;
    setSaving(true);
    try {
      const updatedScenes = scenes.map(s => s.id === activeScene.id ? activeScene : s);
      localStorage.setItem('obs_scenes', JSON.stringify(updatedScenes));
      triggerAlert('success', 'Scene configurations saved successfully to local storage!');
      await fetchScenes(activeScene.id);
    } catch (err: any) {
      triggerAlert('error', `Failed to save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Helper to deep update active scene structure
  const updateActiveScene = (updater: (prev: OBSScene) => OBSScene, shouldPushHistory: boolean = false) => {
    if (!activeScene) return;
    const updated = updater(activeScene);
    const updatedScenes = scenes.map(s => s.id === updated.id ? updated : s);
    setScenes(updatedScenes);
    if (shouldPushHistory) {
      pushToHistory(updatedScenes);
    }
  };

  // Helper to deep update properties of the active layer
  const updateActiveLayer = (updates: Partial<OBSLayer>, shouldPushHistory: boolean = false) => {
    if (!activeScene || !selectedLayerId) return;
    updateActiveScene(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === selectedLayerId ? { ...l, ...updates } : l)
    }), shouldPushHistory);
  };

  // Helper to push to history stack
  const pushToHistory = (customScenes?: OBSScene[]) => {
    const target = customScenes || scenes;
    const newHistory = history.slice(0, historyIndex + 1);
    const updated = [...newHistory, JSON.parse(JSON.stringify(target))].slice(-50);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  // Undo Action
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      const restored = JSON.parse(JSON.stringify(history[prevIndex]));
      setScenes(restored);
      triggerAlert('success', 'Undo action performed.');
    } else {
      triggerAlert('error', 'Nothing to undo.');
    }
  };

  // Redo Action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const restored = JSON.parse(JSON.stringify(history[nextIndex]));
      setScenes(restored);
      triggerAlert('success', 'Redo action performed.');
    } else {
      triggerAlert('error', 'Nothing to redo.');
    }
  };

  // Duplicate Layer
  const handleDuplicateLayer = (layerId: string) => {
    if (!activeScene) return;
    const original = activeScene.layers.find(l => l.id === layerId);
    if (!original) return;

    const id = `layer-${Date.now()}`;
    const zIndex = activeScene.layers.length > 0 
      ? Math.max(...activeScene.layers.map(l => l.zIndex)) + 1 
      : 1;

    const duplicate: OBSLayer = {
      ...JSON.parse(JSON.stringify(original)),
      id,
      name: `${original.name} (Copy)`,
      zIndex,
      top: Math.min(90, original.top + 3),
      left: Math.min(90, original.left + 3)
    };

    const updatedLayers = [...activeScene.layers, duplicate];
    updateActiveScene(prev => ({
      ...prev,
      layers: updatedLayers
    }));
    setSelectedLayerIds([id]);
    pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: updatedLayers } : s));
    triggerAlert('success', `Duplicated layer "${original.name}"`);
  };

  // Download Scene Config as JSON File
  const handleExportJSON = () => {
    if (!activeScene) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeScene, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeScene.id}-scene-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerAlert('success', 'Scene configuration downloaded as JSON.');
  };

  // Load JSON Config File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (!parsed.id || !parsed.title || !Array.isArray(parsed.layers)) {
            throw new Error("Invalid configuration file schema.");
          }
          const exists = scenes.some(s => s.id === parsed.id);
          if (exists) {
            parsed.id = `${parsed.id}-imported-${Date.now()}`;
            parsed.title = `${parsed.title} (Imported)`;
          }
          const updatedScenes = [...scenes, parsed];
          setScenes(updatedScenes);
          setSelectedSceneId(parsed.id);
          setSelectedLayerIds(parsed.layers[0] ? [parsed.layers[0].id] : []);
          pushToHistory(updatedScenes);
          triggerAlert('success', `Imported scene "${parsed.title}" successfully!`);
        } catch (err: any) {
          triggerAlert('error', `Import failed: ${err.message}`);
        }
      };
    }
  };

  // Reset Scenes Canvas to Seed Factory Defaults
  const handleResetDefaults = async () => {
    if (!activeScene) return;
    const isTemplate = activeScene.id in FACTORY_TEMPLATES;
    const confirmMsg = isTemplate
      ? `Are you sure you want to reset "${activeScene.title}" to its factory default template layers? This will discard your current customizations for this scene.`
      : `Are you sure you want to reset "${activeScene.title}"? Since this is a custom/blank scene, this will clear all of its layers.`;

    if (!window.confirm(confirmMsg)) return;

    setSaving(true);
    try {
      const newLayers = isTemplate
        ? JSON.parse(JSON.stringify(FACTORY_TEMPLATES[activeScene.id]))
        : [];
      
      const updatedScene = { ...activeScene, layers: newLayers };
      const updatedScenes = scenes.map(s => s.id === activeScene.id ? updatedScene : s);

      // Save to local storage
      localStorage.setItem('obs_scenes', JSON.stringify(updatedScenes));
      setScenes(updatedScenes);
      setSelectedLayerIds([]);
      pushToHistory(updatedScenes);
      triggerAlert('success', isTemplate ? `Successfully reset "${activeScene.title}" to default template!` : `Cleared all layers for "${activeScene.title}".`);
    } catch (err: any) {
      triggerAlert('error', `Reset failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Align Multiple Selected Layers (supporting synchronous multi-axis alignments to avoid state race conditions)
  const handleGroupAlign = (
    alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-x' | 'center-y' | ('left' | 'right' | 'top' | 'bottom' | 'center-x' | 'center-y')[],
    targetOverride?: 'selection' | 'canvas' | 'first-selected' | 'last-selected'
  ) => {
    if (selectedLayerIds.length === 0 || !activeScene) return;
    const alignments = Array.isArray(alignment) ? alignment : [alignment];
    const target = targetOverride || alignTarget;

    let updatedLayers = JSON.parse(JSON.stringify(activeScene.layers)) as OBSLayer[];

    for (const align of alignments) {
      const targetLayers = updatedLayers.filter(l => selectedLayerIds.includes(l.id));
      if (targetLayers.length === 0) continue;

      if (target === 'canvas') {
        updatedLayers = updatedLayers.map(l => {
          if (!selectedLayerIds.includes(l.id)) return l;
          if (align === 'left') {
            return { ...l, left: 0 };
          } else if (align === 'top') {
            return { ...l, top: 0 };
          } else if (align === 'right') {
            return { ...l, left: parseFloat((100 - l.width).toFixed(2)) };
          } else if (align === 'bottom') {
            return { ...l, top: parseFloat((100 - l.height).toFixed(2)) };
          } else if (align === 'center-x') {
            return { ...l, left: parseFloat(((100 - l.width) / 2).toFixed(2)) };
          } else { // center-y
            return { ...l, top: parseFloat(((100 - l.height) / 2).toFixed(2)) };
          }
        });
      } else if (target === 'first-selected') {
        const firstId = selectedLayerIds[0];
        const anchor = updatedLayers.find(l => l.id === firstId);
        if (!anchor) continue;
        updatedLayers = updatedLayers.map(l => {
          if (!selectedLayerIds.includes(l.id) || l.id === firstId) return l;
          if (align === 'left') {
            return { ...l, left: anchor.left };
          } else if (align === 'top') {
            return { ...l, top: anchor.top };
          } else if (align === 'right') {
            return { ...l, left: parseFloat((anchor.left + anchor.width - l.width).toFixed(2)) };
          } else if (align === 'bottom') {
            return { ...l, top: parseFloat((anchor.top + anchor.height - l.height).toFixed(2)) };
          } else if (align === 'center-x') {
            return { ...l, left: parseFloat((anchor.left + (anchor.width - l.width) / 2).toFixed(2)) };
          } else { // center-y
            return { ...l, top: parseFloat((anchor.top + (anchor.height - l.height) / 2).toFixed(2)) };
          }
        });
      } else if (target === 'last-selected') {
        const lastId = selectedLayerIds[selectedLayerIds.length - 1];
        const anchor = updatedLayers.find(l => l.id === lastId);
        if (!anchor) continue;
        updatedLayers = updatedLayers.map(l => {
          if (!selectedLayerIds.includes(l.id) || l.id === lastId) return l;
          if (align === 'left') {
            return { ...l, left: anchor.left };
          } else if (align === 'top') {
            return { ...l, top: anchor.top };
          } else if (align === 'right') {
            return { ...l, left: parseFloat((anchor.left + anchor.width - l.width).toFixed(2)) };
          } else if (align === 'bottom') {
            return { ...l, top: parseFloat((anchor.top + anchor.height - l.height).toFixed(2)) };
          } else if (align === 'center-x') {
            return { ...l, left: parseFloat((anchor.left + (anchor.width - l.width) / 2).toFixed(2)) };
          } else { // center-y
            return { ...l, top: parseFloat((anchor.top + (anchor.height - l.height) / 2).toFixed(2)) };
          }
        });
      } else {
        // selection bounds (default)
        if (align === 'left') {
          const minLeft = Math.min(...targetLayers.map(l => l.left));
          updatedLayers = updatedLayers.map(l => selectedLayerIds.includes(l.id) ? { ...l, left: minLeft } : l);
        } else if (align === 'top') {
          const minTop = Math.min(...targetLayers.map(l => l.top));
          updatedLayers = updatedLayers.map(l => selectedLayerIds.includes(l.id) ? { ...l, top: minTop } : l);
        } else if (align === 'right') {
          const maxRight = Math.max(...targetLayers.map(l => l.left + l.width));
          updatedLayers = updatedLayers.map(l => selectedLayerIds.includes(l.id) ? { ...l, left: parseFloat((maxRight - l.width).toFixed(2)) } : l);
        } else if (align === 'bottom') {
          const maxBottom = Math.max(...targetLayers.map(l => l.top + l.height));
          updatedLayers = updatedLayers.map(l => selectedLayerIds.includes(l.id) ? { ...l, top: parseFloat((maxBottom - l.height).toFixed(2)) } : l);
        } else if (align === 'center-x') {
          const minLeft = Math.min(...targetLayers.map(l => l.left));
          const maxRight = Math.max(...targetLayers.map(l => l.left + l.width));
          const groupCenterX = minLeft + (maxRight - minLeft) / 2;
          updatedLayers = updatedLayers.map(l => selectedLayerIds.includes(l.id) ? { ...l, left: parseFloat((groupCenterX - l.width / 2).toFixed(2)) } : l);
        } else if (align === 'center-y') {
          const minTop = Math.min(...targetLayers.map(l => l.top));
          const maxBottom = Math.max(...targetLayers.map(l => l.top + l.height));
          const groupCenterY = minTop + (maxBottom - minTop) / 2;
          updatedLayers = updatedLayers.map(l => selectedLayerIds.includes(l.id) ? { ...l, top: parseFloat((groupCenterY - l.height / 2).toFixed(2)) } : l);
        }
      }
    }

    const updatedScenes = scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: updatedLayers } : s);
    setScenes(updatedScenes);
    pushToHistory(updatedScenes);
    triggerAlert('success', `Aligned layers to ${target}`);
  };

  // Distribute Multiple Selected Layers
  const handleGroupDistribute = (direction: 'horizontal' | 'vertical') => {
    if (selectedLayerIds.length <= 2 || !activeScene) {
      triggerAlert('error', 'Select 3 or more layers to distribute.');
      return;
    }
    const targetLayers = activeScene.layers.filter(l => selectedLayerIds.includes(l.id));
    let updatedLayers = [...activeScene.layers];

    if (direction === 'horizontal') {
      const sorted = [...targetLayers].sort((a, b) => a.left - b.left);
      const leftBound = sorted[0].left;
      const rightBound = sorted[sorted.length - 1].left + sorted[sorted.length - 1].width;
      const totalWidth = rightBound - leftBound;
      const count = sorted.length;

      updatedLayers = activeScene.layers.map(l => {
        if (!selectedLayerIds.includes(l.id)) return l;
        const index = sorted.findIndex(s => s.id === l.id);
        if (index === 0 || index === count - 1) return l; // Anchor first and last
        const step = (totalWidth - l.width) / (count - 1);
        const newLeft = leftBound + index * step;
        return { ...l, left: parseFloat(newLeft.toFixed(2)) };
      });
    } else if (direction === 'vertical') {
      const sorted = [...targetLayers].sort((a, b) => a.top - b.top);
      const topBound = sorted[0].top;
      const bottomBound = sorted[sorted.length - 1].top + sorted[sorted.length - 1].height;
      const totalHeight = bottomBound - topBound;
      const count = sorted.length;

      updatedLayers = activeScene.layers.map(l => {
        if (!selectedLayerIds.includes(l.id)) return l;
        const index = sorted.findIndex(s => s.id === l.id);
        if (index === 0 || index === count - 1) return l; // Anchor first and last
        const step = (totalHeight - l.height) / (count - 1);
        const newTop = topBound + index * step;
        return { ...l, top: parseFloat(newTop.toFixed(2)) };
      });
    }

    updateActiveScene(prev => ({ ...prev, layers: updatedLayers }));
    pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: updatedLayers } : s));
    triggerAlert('success', `Distributed layers ${direction === 'horizontal' ? 'horizontally' : 'vertically'}`);
  };

  // Keyboard Event Handlers for Undo/Redo triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.metaKey || e.ctrlKey;
      if (isCtrlOrCmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex]);

  // Create a brand new blank scene
  const handleCreateNewScene = () => {
    const newId = `scene-${Date.now()}`;
    const newScene: OBSScene = {
      id: newId,
      title: 'New Custom Overlay',
      description: 'Fully customizable OBS source scene.',
      width: 1920,
      height: 1080,
      layers: [
        {
          id: `layer-${Date.now()}-bg`,
          name: 'Solid Background',
          type: 'color',
          visible: true,
          opacity: 0.5,
          top: 20,
          left: 20,
          width: 60,
          height: 60,
          zIndex: 1,
          bgColor: '#1e1b4b'
        },
        {
          id: `layer-${Date.now()}-txt`,
          name: 'Welcome Text',
          type: 'text',
          visible: true,
          opacity: 1,
          top: 40,
          left: 20,
          width: 60,
          height: 20,
          zIndex: 2,
          text: 'YOUR OVERLAY TEXT HERE',
          fontFamily: 'Orbitron',
          fontSize: 32,
          color: '#ffffff',
          textPlacement: 'center',
          fontWeight: 'bold',
          letterSpacing: 2
        }
      ]
    };

    const updated = [...scenes, newScene];
    setScenes(updated);
    setSelectedSceneId(newId);
    setSelectedLayerIds([newScene.layers[1].id]);
    pushToHistory(updated);
    triggerAlert('success', 'Created a new custom scene frame! Click Save to store locally.');
  };

  // Delete the currently active scene
  const handleDeleteScene = async () => {
    if (scenes.length <= 1) {
      triggerAlert('error', 'Cannot delete the only remaining scene.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${activeScene?.title}"?`)) return;

    const remainingScenes = scenes.filter(s => s.id !== selectedSceneId);
    try {
      setSaving(true);
      // Save remaining scenes to local storage
      localStorage.setItem('obs_scenes', JSON.stringify(remainingScenes));
      triggerAlert('success', 'Scene deleted successfully.');
      setScenes(remainingScenes);
      setSelectedSceneId(remainingScenes[0].id);
      setSelectedLayerIds([]);
      pushToHistory(remainingScenes);
    } catch (err: any) {
      triggerAlert('error', `Failed to delete scene: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Add a layer to the active scene
  const handleAddLayer = (type: 'text' | 'color' | 'gradient' | 'animated-gradient' | 'image' | 'countdown') => {
    if (!activeScene) return;

    const id = `layer-${Date.now()}`;
    const zIndex = activeScene.layers.length > 0 
      ? Math.max(...activeScene.layers.map(l => l.zIndex)) + 1 
      : 1;

    let newLayer: OBSLayer = {
      id,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      visible: true,
      opacity: 1,
      top: 30,
      left: 30,
      width: 40,
      height: 40,
      zIndex
    };

    if (type === 'text') {
      newLayer.text = 'New Text Label';
      newLayer.fontFamily = 'Inter';
      newLayer.fontSize = 24;
      newLayer.color = '#ffffff';
      newLayer.textPlacement = 'center';
      newLayer.fontWeight = 'normal';
    } else if (type === 'color') {
      newLayer.bgColor = 'rgba(99, 102, 241, 0.6)';
    } else if (type === 'gradient') {
      newLayer.gradientType = 'linear';
      newLayer.gradientAngle = 90;
      newLayer.gradientColors = ['#6366f1', '#a855f7'];
      newLayer.gradientStops = [0, 100];
    } else if (type === 'animated-gradient') {
      newLayer.gradientType = 'linear';
      newLayer.gradientAngle = 45;
      newLayer.gradientColors = ['#f43f5e', '#ec4899', '#8b5cf6'];
      newLayer.gradientStops = [0, 50, 100];
      newLayer.animationSpeed = 8;
      newLayer.animationType = 'shift';
      newLayer.animationTimingFunction = 'ease-in-out';
    } else if (type === 'image') {
      newLayer.imageUrl = QUICK_IMAGE_PRESETS[0].url;
      newLayer.objectFit = 'cover';
    } else if (type === 'countdown') {
      newLayer.countdownDuration = 300;
      newLayer.fontFamily = 'Orbitron';
      newLayer.fontSize = 32;
      newLayer.color = '#ffffff';
      newLayer.textPlacement = 'center';
      newLayer.fontWeight = 'bold';
    }

    const updatedLayers = [...activeScene.layers, newLayer];
    updateActiveScene(prev => ({
      ...prev,
      layers: updatedLayers
    }));
    setSelectedLayerIds([id]);
    pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: updatedLayers } : s));
    triggerAlert('success', `Added ${type} layer.`);
  };

  // Reorder layer positions in the array (changes draw/rendering order)
  const handleMoveLayer = (direction: 'up' | 'down') => {
    if (!activeScene || !selectedLayerId) return;

    const index = activeScene.layers.findIndex(l => l.id === selectedLayerId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index + 1 : index - 1;
    if (targetIndex < 0 || targetIndex >= activeScene.layers.length) return;

    const updatedLayers = [...activeScene.layers];
    const temp = updatedLayers[index];
    updatedLayers[index] = updatedLayers[targetIndex];
    updatedLayers[targetIndex] = temp;

    const reindexedLayers = updatedLayers.map((l, i) => ({
      ...l,
      zIndex: i + 1
    }));

    updateActiveScene(prev => ({
      ...prev,
      layers: reindexedLayers
    }));
    pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: reindexedLayers } : s));
  };

  // Delete a layer from the active scene
  const handleDeleteLayer = (layerId: string) => {
    if (!activeScene) return;
    
    const updatedLayers = activeScene.layers.filter(l => l.id !== layerId);
    updateActiveScene(prev => ({
      ...prev,
      layers: updatedLayers
    }));

    if (selectedLayerIds.includes(layerId)) {
      setSelectedLayerIds(prev => prev.filter(id => id !== layerId));
    }
    pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: updatedLayers } : s));
    triggerAlert('success', 'Layer removed.');
  };

  // Toggle visible attribute on a layer
  const handleToggleVisibility = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeScene) return;

    const updatedLayers = activeScene.layers.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l);
    updateActiveScene(prev => ({
      ...prev,
      layers: updatedLayers
    }));
    pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: updatedLayers } : s));
  };

  // Copy OBS Web Source URL
  const handleCopyOBSUrl = () => {
    if (!activeScene) return;
    const origin = window.location.origin;
    const url = `${origin}/obs?sourceId=${activeScene.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      triggerAlert('success', 'OBS Source URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Interactive mouse drag to reposition the layer on the canvas preview
  const handleLayerDragStart = (layer: OBSLayer, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedLayerIds.includes(layer.id)) {
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        setSelectedLayerIds(prev => [...prev, layer.id]);
      } else {
        setSelectedLayerIds([layer.id]);
      }
    }

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = layer.left;
    const startTop = layer.top;
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const deltaPercentX = (deltaX / canvasWidth) * 100;
      const deltaPercentY = (deltaY / canvasHeight) * 100;

      let newLeft = parseFloat((startLeft + deltaPercentX).toFixed(2));
      let newTop = parseFloat((startTop + deltaPercentY).toFixed(2));

      // Limit/clamp coordinates inside canvas bounds
      newLeft = Math.max(0, Math.min(100 - layer.width, newLeft));
      newTop = Math.max(0, Math.min(100 - layer.height, newTop));

      updateActiveLayer({ left: newLeft, top: newTop });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      pushToHistory();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Interactive mouse drag on resize handle to scale the layer
  const handleResizeStart = (layer: OBSLayer, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = layer.width;
    const startHeight = layer.height;
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const deltaPercentW = (deltaX / canvasWidth) * 100;
      const deltaPercentH = (deltaY / canvasHeight) * 100;

      let newWidth = parseFloat((startWidth + deltaPercentW).toFixed(2));
      let newHeight = parseFloat((startHeight + deltaPercentH).toFixed(2));

      // Limit/clamp scaling so layer doesn't exceed canvas edge
      newWidth = Math.max(1, Math.min(100 - layer.left, newWidth));
      newHeight = Math.max(1, Math.min(100 - layer.top, newHeight));

      updateActiveLayer({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      pushToHistory();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Helper to parse placement styles into flexbox coordinates
  const getPlacementStyles = (placement: string = 'center') => {
    let justifyContent = 'center';
    let alignItems = 'center';
    let textAlign: 'left' | 'center' | 'right' = 'center';

    switch (placement) {
      case 'top-left':
        justifyContent = 'flex-start';
        alignItems = 'flex-start';
        textAlign = 'left';
        break;
      case 'top-center':
        justifyContent = 'center';
        alignItems = 'flex-start';
        textAlign = 'center';
        break;
      case 'top-right':
        justifyContent = 'flex-end';
        alignItems = 'flex-start';
        textAlign = 'right';
        break;
      case 'center-left':
        justifyContent = 'flex-start';
        alignItems = 'center';
        textAlign = 'left';
        break;
      case 'center':
        justifyContent = 'center';
        alignItems = 'center';
        textAlign = 'center';
        break;
      case 'center-right':
        justifyContent = 'flex-end';
        alignItems = 'center';
        textAlign = 'right';
        break;
      case 'bottom-left':
        justifyContent = 'flex-start';
        alignItems = 'flex-end';
        textAlign = 'left';
        break;
      case 'bottom-center':
        justifyContent = 'center';
        alignItems = 'flex-end';
        textAlign = 'center';
        break;
      case 'bottom-right':
        justifyContent = 'flex-end';
        alignItems = 'flex-end';
        textAlign = 'right';
        break;
    }

    return { justifyContent, alignItems, textAlign };
  };

  // Gradient stops handlers for active selected layer
  const handleGradientStopColorChange = (index: number, newColor: string) => {
    if (!activeLayer) return;
    const colors = activeLayer.gradientColors || ['#ff007f', '#7f00ff'];
    const stops = activeLayer.gradientStops || colors.map((_, i) => Math.round((i / (colors.length - 1)) * 100));

    const newColors = [...colors];
    newColors[index] = newColor;
    updateActiveLayer({ gradientColors: newColors, gradientStops: stops });
  };

  const handleGradientStopPercentChange = (index: number, newPercent: number) => {
    if (!activeLayer) return;
    const colors = activeLayer.gradientColors || ['#ff007f', '#7f00ff'];
    const stops = activeLayer.gradientStops || colors.map((_, i) => Math.round((i / (colors.length - 1)) * 100));

    const newStops = [...stops];
    newStops[index] = newPercent;
    updateActiveLayer({ gradientStops: newStops });
  };

  const handleGradientRemoveStop = (index: number) => {
    if (!activeLayer) return;
    const colors = activeLayer.gradientColors || ['#ff007f', '#7f00ff'];
    const stops = activeLayer.gradientStops || colors.map((_, i) => Math.round((i / (colors.length - 1)) * 100));

    if (colors.length <= 2) return;
    const newColors = colors.filter((_, i) => i !== index);
    const newStops = stops.filter((_, i) => i !== index);
    updateActiveLayer({ gradientColors: newColors, gradientStops: newStops });
  };

  const handleGradientAddStop = () => {
    if (!activeLayer) return;
    const colors = activeLayer.gradientColors || ['#ff007f', '#7f00ff'];
    const stops = activeLayer.gradientStops || colors.map((_, i) => Math.round((i / (colors.length - 1)) * 100));

    const newColors = [...colors, '#ffffff'];
    const newStops = [...stops, 50]; // Defaults in the middle
    updateActiveLayer({ gradientColors: newColors, gradientStops: newStops });
  };

  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    e.dataTransfer.setData("text/plain", layerId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === targetLayerId || !activeScene) return;

    const currentLayers = activeScene.layers;
    const draggedIndex = currentLayers.findIndex(l => l.id === draggedId);
    const targetIndex = currentLayers.findIndex(l => l.id === targetLayerId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLayers = [...currentLayers];
    const [removed] = newLayers.splice(draggedIndex, 1);
    newLayers.splice(targetIndex, 0, removed);

    const reindexed = newLayers.map((l, i) => ({
      ...l,
      zIndex: i + 1
    }));

    updateActiveScene(prev => ({
      ...prev,
      layers: reindexed
    }));
    pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: reindexed } : s));
  };

  const handleSelectLayer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedLayerIds(prev => {
        if (prev.includes(id)) {
          return prev.filter(item => item !== id);
        } else {
          return [...prev, id];
        }
      });
    } else {
      setSelectedLayerIds([id]);
    }
  };

  // Draw ordered layers (for preview, bottom layers render first)
  const previewLayers = activeScene ? [...activeScene.layers].sort((a, b) => a.zIndex - b.zIndex) : [];

  return (
    <div className="h-screen w-screen bg-[#0f0f10] text-[#ededed] flex flex-col overflow-hidden font-sans select-none">
      
      {/* Alert toast notification */}
      {alertMsg && (
        <div className={`fixed top-4 right-4 px-5 py-3.5 rounded-xl border z-50 flex items-center gap-3 shadow-2xl transition-all animate-bounce ${
          alertMsg.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' 
            : 'bg-red-950/90 border-red-500/30 text-red-400 shadow-red-500/10'
        }`}>
          <div className="h-2 w-2 rounded-full bg-current animate-ping" />
          <span className="text-xs font-semibold">{alertMsg.text}</span>
        </div>
      )}

      {/* GPU Accelerated Gradient Animations */}
      <style>{`
        @keyframes obsGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes obsGradientRotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes obsGradientWave {
          0% { background-position: 0% 0%; }
          50% { background-position: 50% 100%; }
          100% { background-position: 0% 0%; }
        }
        .checkerboard {
          background-color: #141416;
          background-image: linear-gradient(45deg, #18181b 25%, transparent 25%),
                            linear-gradient(-45deg, #18181b 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #18181b 75%),
                            linear-gradient(-45deg, transparent 75%, #18181b 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #252528;
          border-radius: 9px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b3b40;
        }
      `}</style>

      {/* Premium Header */}
      <header className="h-14 flex-none bg-[#141416] border-b border-[#232326] px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors mr-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Monitor className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wider text-slate-100 flex items-center gap-2">
              OBS Source Studio
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest leading-none">MVP</span>
            </h1>
            <p className="text-[9px] text-slate-500 leading-none">Complete 10-70-20 visual workspace designer</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Overlay Scene:</span>
            <select
              value={selectedSceneId}
              onChange={(e) => {
                setSelectedSceneId(e.target.value);
                setSelectedLayerIds([]);
              }}
              className="bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none font-medium focus:border-indigo-500 max-w-[200px]"
            >
              {scenes.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateNewScene}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-white/5 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>

          <button
            onClick={handleDeleteScene}
            className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/25 cursor-pointer"
            title="Delete Scene"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-[#232326] mx-1" />

          {/* Undo and Redo Tools */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 bg-[#1b1b1d] border border-[#2d2d31] hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Undo Action (Cmd+Z)"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 bg-[#1b1b1d] border border-[#2d2d31] hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Redo Action (Cmd+Shift+Z)"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* JSON Schema Import & Export */}
          <input 
            type="file" 
            id="json-import-input" 
            accept=".json" 
            onChange={handleImportJSON} 
            className="hidden" 
          />
          <button
            onClick={() => document.getElementById('json-import-input')?.click()}
            className="px-2.5 py-1 bg-white/5 hover:bg-[#1e1b4b] hover:text-indigo-300 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-white/5 flex items-center gap-1 cursor-pointer"
            title="Import configuration JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>
          <button
            onClick={handleExportJSON}
            disabled={!activeScene}
            className="px-2.5 py-1 bg-white/5 hover:bg-[#311042] hover:text-pink-300 hover:border-pink-500/40 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-white/5 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Export configuration JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          {/* Reset scene to seeded defaults */}
          <button
            onClick={handleResetDefaults}
            className="px-2.5 py-1 bg-white/5 hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/30 text-slate-400 text-xs font-semibold rounded-lg transition-colors border border-white/5 flex items-center gap-1 cursor-pointer"
            title="Reset Canvas to seeded default presets"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="h-5 w-[1px] bg-[#232326] mx-1" />

          <button
            onClick={handleSaveScene}
            disabled={saving || !activeScene}
            className="px-3.5 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all flex items-center gap-1 shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save changes
          </button>
        </div>
      </header>

      {/* Main 3-Column Workspace */}
      <main className="flex-1 flex overflow-hidden w-full h-full relative">
        
        {/* COLUMN 1: Layers Sidebar (Ratio 10% - w-[10%] min-w-[200px] max-w-[240px]) */}
        <section className="w-[12%] min-w-[200px] max-w-[240px] flex-none bg-[#141416] border-r border-[#232326] flex flex-col overflow-hidden h-full">
          
          {/* Quick Add Inline Panel */}
          <div className="flex-none p-3 border-b border-[#232326] bg-[#101012]/30 space-y-2">
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">
              <Plus className="w-3 h-3 text-indigo-400" /> Quick Add Layer
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button 
                onClick={() => handleAddLayer('text')} 
                className="p-1.5 bg-[#1b1b1d] hover:bg-indigo-600/10 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-center flex flex-col items-center gap-1 transition-all group cursor-pointer"
                title="Add Text Label"
              >
                <Type className="w-3.5 h-3.5 text-[#3b82f6] group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-slate-200">Text</span>
              </button>
              <button 
                onClick={() => handleAddLayer('color')} 
                className="p-1.5 bg-[#1b1b1d] hover:bg-indigo-600/10 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-center flex flex-col items-center gap-1 transition-all group cursor-pointer"
                title="Add Solid Color Panel"
              >
                <Palette className="w-3.5 h-3.5 text-[#10b981] group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-slate-200">Color</span>
              </button>
              <button 
                onClick={() => handleAddLayer('gradient')} 
                className="p-1.5 bg-[#1b1b1d] hover:bg-indigo-600/10 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-center flex flex-col items-center gap-1 transition-all group cursor-pointer"
                title="Add Static Gradient background"
              >
                <Palette className="w-3.5 h-3.5 text-[#a855f7] group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-slate-200">Grad</span>
              </button>
              <button 
                onClick={() => handleAddLayer('animated-gradient')} 
                className="p-1.5 bg-[#1b1b1d] hover:bg-indigo-600/10 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-center flex flex-col items-center gap-1 transition-all group cursor-pointer"
                title="Add Flowing Animated Gradient overlay"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ec4899] group-hover:scale-110 transition-transform animate-pulse" />
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-slate-200">Flow</span>
              </button>
              <button 
                onClick={() => handleAddLayer('image')} 
                className="p-1.5 bg-[#1b1b1d] hover:bg-indigo-600/10 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-center flex flex-col items-center gap-1 transition-all group cursor-pointer"
                title="Add Image Layer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#eab308] group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-slate-200">Image</span>
              </button>
              <button 
                onClick={() => handleAddLayer('countdown')} 
                className="p-1.5 bg-[#1b1b1d] hover:bg-indigo-600/10 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-center flex flex-col items-center gap-1 transition-all group cursor-pointer animate-pulse"
                title="Add Countdown Timer clock"
              >
                <Play className="w-3.5 h-3.5 text-[#f97316] group-hover:scale-110 transition-transform rotate-90" />
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-slate-200">Timer</span>
              </button>
            </div>
          </div>

          {/* List header */}
          <div className="p-3 border-b border-[#232326] flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">
              <Layers className="w-3 h-3" /> Canvas Layers ({activeScene?.layers.length || 0})
            </span>
          </div>

          {/* Layers drag-and-drop Sidebar List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {activeScene?.layers.length === 0 ? (
              <div className="p-4 text-center text-[10px] text-slate-500 italic">No layers added yet. Click above.</div>
            ) : (
              [...(activeScene?.layers || [])].reverse().map((layer) => {
                const isSelected = selectedLayerIds.includes(layer.id);
                
                return (
                  <div
                    key={layer.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, layer.id)}
                    onDragOver={(e) => {
                      handleDragOver(e);
                      setDraggedOverId(layer.id);
                    }}
                    onDragLeave={() => setDraggedOverId(null)}
                    onDrop={(e) => {
                      handleDrop(e, layer.id);
                      setDraggedOverId(null);
                    }}
                    onClick={(e) => handleSelectLayer(layer.id, e)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer group flex items-center justify-between select-none ${
                      draggedOverId === layer.id ? 'border-indigo-400 bg-indigo-500/10 scale-95 border-dashed' : ''
                    } ${
                      isSelected 
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200 shadow-inner' 
                        : 'bg-[#18181b] hover:bg-[#1f1f23] border-[#252528] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Move className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-grab active:cursor-grabbing" />
                      {layer.type === 'text' && <Type className="w-3 h-3 text-[#3b82f6] flex-shrink-0" />}
                      {layer.type === 'color' && <Palette className="w-3 h-3 text-[#10b981] flex-shrink-0" />}
                      {layer.type === 'gradient' && <Palette className="w-3 h-3 text-[#a855f7] flex-shrink-0" />}
                      {layer.type === 'animated-gradient' && <Sparkles className="w-3 h-3 text-[#ec4899] flex-shrink-0 animate-pulse" />}
                      {layer.type === 'image' && <ImageIcon className="w-3 h-3 text-[#eab308] flex-shrink-0" />}
                      {layer.type === 'countdown' && <Play className="w-3 h-3 text-[#f97316] flex-shrink-0 rotate-90" />}

                      <span className="text-[11px] font-bold truncate select-none leading-none">{layer.name}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleToggleVisibility(layer.id, e)}
                        className="p-0.5 rounded hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                        title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                      >
                        {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteLayer(layer.id); }}
                        className="p-0.5 rounded hover:bg-white/5 text-slate-400 hover:text-red-400 cursor-pointer"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Ordering Footer */}
          {selectedLayerId && (
            <div className="p-2 border-t border-[#232326] bg-[#101012] flex items-center justify-between flex-none">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Arrange:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleMoveLayer('down')}
                  className="h-6 w-6 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                  title="Draw behind"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveLayer('up')}
                  className="h-6 w-6 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                  title="Draw on top"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* COLUMN 2: Canvas Simulator (Ratio 70% - flex-1) */}
        <section className="flex-1 bg-[#0d0d0e] flex flex-col overflow-hidden h-full relative">
          
          {/* Action Header */}
          <div className="p-4 border-b border-[#232326] flex items-center justify-between bg-[#101012]/50 flex-none">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Interactive Canvas Simulator (Drag to Position • Drag Handle to Resize • Shift+Click Multi-select)
              </span>
            </div>

            {activeScene && (
              <div className="flex items-center gap-2">
                <div className="bg-[#151517] border border-[#28282b] rounded-lg pl-3 pr-1 py-0.5 flex items-center gap-2">
                  <span className="text-[9px] text-slate-500 font-mono select-all">/obs?sourceId={activeScene.id}</span>
                  <button
                    onClick={handleCopyOBSUrl}
                    className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      copied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy OBS URL'}
                  </button>
                </div>
                <a
                  href={`/obs?sourceId=${activeScene.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
                  title="Open Source in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Canvas Simulator Body */}
          <div 
            className="flex-1 p-8 flex items-center justify-center overflow-auto custom-scrollbar bg-[#09090a]"
            onClick={() => setSelectedLayerIds([])}
          >
            {activeScene ? (
              <div 
                ref={canvasRef}
                id="obs-preview-canvas"
                style={{ 
                  aspectRatio: `${activeScene.width} / ${activeScene.height}`,
                  maxWidth: activeScene.width < activeScene.height ? '380px' : '100%',
                  height: activeScene.width < activeScene.height ? '75vh' : 'auto'
                }}
                className="relative w-full rounded-2xl checkerboard overflow-hidden border border-[#232326] shadow-2xl transition-all scale-100 select-none"
              >
                {previewLayers.map((layer) => {
                  if (!layer.visible) return null;
                  const isSelected = selectedLayerIds.includes(layer.id);

                  // Setup borders and shadows identical to viewer
                  const shadowColor = layer.shadowColor || '#000000';
                  let boxShadow: string | undefined = undefined;
                  if (layer.shadowColor && (layer.shadowBlur !== undefined || layer.shadowOffset)) {
                    const sx = layer.shadowOffset?.x ?? 0;
                    const sy = layer.shadowOffset?.y ?? 4;
                    const sb = layer.shadowBlur ?? 12;
                    const ss = layer.shadowSpread ?? 0;
                    const inset = layer.shadowInset ? 'inset' : '';
                    boxShadow = `${inset} ${sx}px ${sy}px ${sb}px ${ss}px ${shadowColor}`.trim();
                  }

                  const borderStyleObj: React.CSSProperties = {
                    borderRadius: layer.borderRadius !== undefined ? `${layer.borderRadius}px` : undefined,
                    borderWidth: layer.borderWidth !== undefined ? `${layer.borderWidth}px` : undefined,
                    borderColor: layer.borderColor ? toRGBA(layer.borderColor, layer.borderOpacity ?? 1) : undefined,
                    borderStyle: layer.borderWidth ? (layer.borderStyle || 'solid') : undefined,
                    boxShadow: boxShadow,
                    boxSizing: layer.borderType === 'outside' ? 'content-box' : 'border-box',
                    padding: layer.padding !== undefined ? `${layer.padding}px` : undefined,
                    overflow: 'hidden'
                  };

                  const layerPreviewStyle: React.CSSProperties = {
                    position: 'absolute',
                    top: `${layer.top}%`,
                    left: `${layer.left}%`,
                    width: `${layer.width}%`,
                    height: `${layer.height}%`,
                    zIndex: layer.zIndex,
                    opacity: layer.opacity,
                    boxSizing: 'border-box',
                    ...borderStyleObj
                  };

                  let innerVisual = null;

                  // 1. Color Layer
                  if (layer.type === 'color') {
                    innerVisual = (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: layer.bgColor ? toRGBA(layer.bgColor, layer.bgOpacity ?? 1) : 'rgba(0,0,0,0.5)' }}
                      />
                    );
                  }
                  
                  // 2. Gradient Layer
                  if (layer.type === 'gradient') {
                    const colors = layer.gradientColors || [];
                    const colorsList = colors.length > 0
                      ? colors.map((c, i) => {
                          const stop = layer.gradientStops?.[i] !== undefined 
                            ? layer.gradientStops[i] 
                            : Math.round((i / (colors.length - 1)) * 100);
                          const rgbColor = toRGBA(c, layer.bgOpacity ?? 1);
                          return `${rgbColor} ${stop}%`;
                        })
                      : ['#ff007f 0%', '#7f00ff 100%'];
                    
                    const colorsStr = colorsList.join(', ');
                    const bg = layer.gradientType === 'radial'
                      ? `radial-gradient(circle, ${colorsStr})`
                      : `linear-gradient(${layer.gradientAngle || 90}deg, ${colorsStr})`;

                    innerVisual = <div className="w-full h-full" style={{ backgroundImage: bg }} />;
                  }

                  // 3. Animated Gradient Layer
                  if (layer.type === 'animated-gradient') {
                    const colors = layer.gradientColors || [];
                    const colorsList = colors.length > 0
                      ? colors.map((c, i) => {
                          const stop = layer.gradientStops?.[i] !== undefined 
                            ? layer.gradientStops[i] 
                            : Math.round((i / (colors.length - 1)) * 100);
                          const rgbColor = toRGBA(c, layer.bgOpacity ?? 1);
                          return `${rgbColor} ${stop}%`;
                        })
                      : ['#ff007f 0%', '#7f00ff 100%'];
                    
                    const colorsStr = colorsList.join(', ');
                    const speed = layer.animationSpeed || 8;
                    
                    let backgroundImage = '';
                    let backgroundSize = '';
                    let animation = '';

                    const timingFunction = layer.animationTimingFunction || (layer.animationType === 'rotate' ? 'linear' : layer.animationType === 'wave' ? 'ease' : 'ease-in-out');

                    if (layer.animationType === 'rotate') {
                      backgroundImage = layer.gradientType === 'radial'
                        ? `radial-gradient(circle, ${colorsStr})`
                        : `linear-gradient(${layer.gradientAngle || 90}deg, ${colorsStr})`;
                      animation = `obsGradientRotate ${speed}s ${timingFunction} infinite`;
                    } else if (layer.animationType === 'wave') {
                      backgroundImage = layer.gradientType === 'radial'
                        ? `radial-gradient(circle, ${colorsStr})`
                        : `linear-gradient(${layer.gradientAngle || 90}deg, ${colorsStr})`;
                      backgroundSize = '200% 200%';
                      animation = `obsGradientWave ${speed}s ${timingFunction} infinite`;
                    } else {
                      const cycleColor = toRGBA(colors[0] || '#ff007f', layer.bgOpacity ?? 1);
                      const cycleStop = 100 + (layer.gradientStops?.[0] || 0);
                      backgroundImage = `linear-gradient(${layer.gradientAngle || 90}deg, ${colorsStr}, ${cycleColor} ${cycleStop}%)`;
                      backgroundSize = '400% 400%';
                      animation = `obsGradientShift ${speed}s ${timingFunction} infinite`;
                    }

                    innerVisual = (
                      <div 
                        className="w-full h-full" 
                        style={{ backgroundImage, backgroundSize, animation }} 
                      />
                    );
                  }

                  // 4. Image Layer
                  if (layer.type === 'image') {
                    innerVisual = layer.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={layer.imageUrl}
                        alt={layer.name}
                        className="w-full h-full pointer-events-none select-none"
                        style={{ objectFit: layer.objectFit || 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-500/20 text-white/50 text-[10px]">
                        No Image
                      </div>
                    );
                  }

                  // 5. Text Layer
                  if (layer.type === 'text') {
                    const { justifyContent, alignItems, textAlign } = getPlacementStyles(layer.textPlacement);

                    let textShadow = '';
                    const filterParts: string[] = [];

                    if (layer.shadowColor) {
                      const sx = layer.shadowOffset?.x ?? 2;
                      const sy = layer.shadowOffset?.y ?? 2;
                      const sb = layer.shadowBlur ?? 4;
                      textShadow = `${sx}px ${sy}px ${sb}px ${layer.shadowColor}`;
                    }

                    if (layer.outerGlowColor) {
                      filterParts.push(`drop-shadow(0 0 ${layer.outerGlowBlur || 8}px ${layer.outerGlowColor})`);
                    }

                    if (layer.innerGlowColor) {
                      const igb = layer.innerGlowBlur || 2;
                      const innerShadow = `0 0 ${igb}px ${layer.innerGlowColor}`;
                      textShadow = textShadow ? `${textShadow}, ${innerShadow}` : innerShadow;
                    }

                    const textStyle: React.CSSProperties = {
                      fontFamily: layer.fontFamily || 'sans-serif',
                      fontSize: layer.fontSize ? `${layer.fontSize}px` : '24px',
                      color: layer.color || '#ffffff',
                      fontWeight: layer.fontWeight || 'normal',
                      fontStyle: layer.fontStyle || 'normal',
                      textTransform: (layer.textTransform as any) || 'none',
                      letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : 'normal',
                      textShadow: textShadow || undefined,
                      filter: filterParts.length > 0 ? filterParts.join(' ') : undefined,
                      lineHeight: 1.2
                    };

                    let displayText = layer.text || 'Text Layer';
                    // We can let query parameters mock work in editor too if the user provides query in address bar
                    if (layer.fetchFromQuery && layer.queryParamName && typeof window !== 'undefined') {
                      const urlParams = new URLSearchParams(window.location.search);
                      const val = urlParams.get(layer.queryParamName);
                      if (val !== null) displayText = val;
                    }

                    innerVisual = (
                      <div
                        className="w-full h-full flex"
                        style={{ justifyContent, alignItems }}
                      >
                        <span style={{ ...textStyle, textAlign }}>
                          {displayText}
                        </span>
                      </div>
                    );
                  }

                  // 6. Countdown Layer
                  if (layer.type === 'countdown') {
                    let textShadow = '';
                    const filterParts: string[] = [];

                    if (layer.shadowColor) {
                      const sx = layer.shadowOffset?.x ?? 2;
                      const sy = layer.shadowOffset?.y ?? 2;
                      const sb = layer.shadowBlur ?? 4;
                      textShadow = `${sx}px ${sy}px ${sb}px ${layer.shadowColor}`;
                    }

                    if (layer.outerGlowColor) {
                      filterParts.push(`drop-shadow(0 0 ${layer.outerGlowBlur || 8}px ${layer.outerGlowColor})`);
                    }

                    if (layer.innerGlowColor) {
                      const igb = layer.innerGlowBlur || 2;
                      const innerShadow = `0 0 ${igb}px ${layer.innerGlowColor}`;
                      textShadow = textShadow ? `${textShadow}, ${innerShadow}` : innerShadow;
                    }

                    const textStyle: React.CSSProperties = {
                      fontFamily: layer.fontFamily || 'sans-serif',
                      fontSize: layer.fontSize ? `${layer.fontSize}px` : '24px',
                      color: layer.color || '#ffffff',
                      fontWeight: layer.fontWeight || 'normal',
                      fontStyle: layer.fontStyle || 'normal',
                      textTransform: (layer.textTransform as any) || 'none',
                      letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : 'normal',
                      textShadow: textShadow || undefined,
                      filter: filterParts.length > 0 ? filterParts.join(' ') : undefined,
                      lineHeight: 1.2
                    };

                    innerVisual = (
                      <CountdownTimer
                        duration={layer.countdownDuration || 300}
                        style={textStyle}
                        textPlacement={layer.textPlacement}
                      />
                    );
                  }

                  return (
                    <div
                      key={layer.id}
                      style={layerPreviewStyle}
                      onMouseDown={(e) => handleLayerDragStart(layer, e)}
                      onClick={(e) => e.stopPropagation()}
                      onContextMenu={(e) => handleContextMenu(e, layer.id)}
                      className={`hover:outline-dashed hover:outline-indigo-500/50 hover:outline-2 group/drag cursor-move transition-shadow ${
                        isSelected ? 'outline outline-[#ec4899] outline-2 ring-4 ring-[#ec4899]/15' : ''
                      }`}
                    >
                      {innerVisual}

                      {/* Top layer visual indicator */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 bg-[#ec4899] text-white text-[7px] font-bold px-1 py-0.5 rounded-br uppercase tracking-widest leading-none select-none pointer-events-none z-40">
                          {layer.name}
                        </div>
                      )}

                      {/* Interactive Drag icon indicator overlay on hover */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover/drag:opacity-60 transition-opacity bg-black/60 rounded p-0.5 pointer-events-none">
                          <Move className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}

                      {/* Glowing Bottom-Right RESIZE HANDLE */}
                      {isSelected && selectedLayerIds.length === 1 && (
                        <div
                          onMouseDown={(e) => handleResizeStart(layer, e)}
                          className="absolute bottom-0 right-0 h-4 w-4 bg-[#ec4899] border-2 border-white rounded-full cursor-se-resize flex items-center justify-center shadow-lg hover:scale-125 transition-transform z-50 translate-x-[4px] translate-y-[4px]"
                          title="Drag to resize layer span"
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Floating Canvas Context Menu */}
                {contextMenu && (
                  <div 
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                    className="absolute bg-[#1e1e21] border border-[#2d2d31] rounded-xl shadow-2xl py-1.5 z-50 w-44 text-left select-none animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => { handleDuplicateLayer(contextMenu.layerId); setContextMenu(null); }} 
                      className="w-full px-3 py-1.5 hover:bg-white/5 text-left text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-400" /> Duplicate Layer
                    </button>
                    <button 
                      onClick={() => {
                        const updated = activeScene.layers.map(l => l.id === contextMenu.layerId ? { ...l, visible: !l.visible } : l);
                        updateActiveScene(prev => ({ ...prev, layers: updated }));
                        pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, layers: updated } : s));
                        setContextMenu(null);
                      }} 
                      className="w-full px-3 py-1.5 hover:bg-white/5 text-left text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> Toggle Visibility
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedLayerIds([contextMenu.layerId]);
                        handleMoveLayer('up');
                        setContextMenu(null);
                      }} 
                      className="w-full px-3 py-1.5 hover:bg-white/5 text-left text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-indigo-400" /> Bring Forward
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedLayerIds([contextMenu.layerId]);
                        handleMoveLayer('down');
                        setContextMenu(null);
                      }} 
                      className="w-full px-3 py-1.5 hover:bg-white/5 text-left text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-indigo-400" /> Send Backward
                    </button>
                    <div className="h-[1px] bg-[#232326] my-1" />
                    <button 
                      onClick={() => { handleDeleteLayer(contextMenu.layerId); setContextMenu(null); }} 
                      className="w-full px-3 py-1.5 hover:bg-red-500/10 text-left text-xs font-semibold text-red-400 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Layer
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="aspect-video w-full max-w-4xl bg-[#141416] rounded-2xl flex items-center justify-center text-slate-500 italic text-xs uppercase tracking-widest">
                No active scene loaded.
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 3: Property Customizer Sidebar (Ratio 20% - w-[20%] min-w-[320px] max-w-[400px]) */}
        <section className="w-[22%] min-w-[320px] max-w-[400px] flex-none bg-[#141416] border-l border-[#232326] flex flex-col h-full overflow-y-auto custom-scrollbar p-5">
          
          {/* FALLBACK STATE 1: No Layer Selected -> Scene settings */}
          {selectedLayerIds.length === 0 ? (
            <div className="space-y-6 h-full">
              <div className="border-b border-[#232326] pb-3 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5" /> Scene settings
                </span>
                <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">{activeScene?.title}</h2>
              </div>

              {activeScene ? (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Scene Title:</label>
                    <input
                      type="text"
                      value={activeScene.title}
                      onChange={(e) => updateActiveScene(prev => ({ ...prev, title: e.target.value }))}
                      onBlur={() => pushToHistory()}
                      className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Description:</label>
                    <textarea
                      value={activeScene.description || ''}
                      onChange={(e) => updateActiveScene(prev => ({ ...prev, description: e.target.value }))}
                      onBlur={() => pushToHistory()}
                      rows={2}
                      className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 resize-none font-medium"
                    />
                  </div>

                  <div className="bg-[#18181b] border border-[#232326] p-3.5 rounded-xl space-y-3.5">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Simulator Aspect Dimensions</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-semibold block uppercase">Width (px):</label>
                        <input 
                          type="number" 
                          value={activeScene.width} 
                          onChange={(e) => updateActiveScene(prev => ({ ...prev, width: parseInt(e.target.value) || 1920 }))}
                          onBlur={() => pushToHistory()}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-semibold block uppercase">Height (px):</label>
                        <input 
                          type="number" 
                          value={activeScene.height} 
                          onChange={(e) => updateActiveScene(prev => ({ ...prev, height: parseInt(e.target.value) || 1080 }))}
                          onBlur={() => pushToHistory()}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1.5 border-t border-[#232326]/60">
                      <label className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Quick Presets:</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { name: '1080p Stream (16:9)', w: 1920, h: 1080 },
                          { name: '720p Stream (16:9)', w: 1280, h: 720 },
                          { name: 'TikTok Mobile (9:16)', w: 1080, h: 1920 },
                          { name: 'Square Box (1:1)', w: 1080, h: 1080 }
                        ].map(preset => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              updateActiveScene(prev => ({ ...prev, width: preset.w, height: preset.h }));
                              pushToHistory(scenes.map(s => s.id === activeScene.id ? { ...activeScene, width: preset.w, height: preset.h } : s));
                            }}
                            className="px-2 py-1.5 bg-[#1b1b1d] border border-[#2d2d31] hover:border-indigo-500/50 hover:bg-white/5 rounded text-[9px] text-slate-300 font-semibold transition-all cursor-pointer text-left truncate"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#232326] text-center text-[10px] text-slate-500 leading-relaxed italic">
                    Tip: Select any layer directly in the canvas or sidebar to open the layout, neon glow, and borders configurator.
                  </div>
                </div>
              ) : (
                <div className="text-center text-[10px] text-slate-500 italic">No scene details.</div>
              )}
            </div>
          ) : selectedLayerIds.length > 1 ? (
            /* STATE 2: Multiple Layers Selected -> Group Alignments */
            <div className="space-y-6 h-full">
              <div className="border-b border-[#232326] pb-3 space-y-1">
                <span className="text-[10px] font-bold text-pink-400 tracking-widest uppercase flex items-center gap-1">
                  <Grid className="w-3.5 h-3.5" /> Group Properties
                </span>
                <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">{selectedLayerIds.length} Layers Selected</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-[#18181b] border border-[#232326] p-3.5 rounded-xl space-y-3">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Align Relative To</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['selection', 'canvas', 'first-selected', 'last-selected'] as const).map((target) => (
                      <button
                        key={target}
                        onClick={() => setAlignTarget(target)}
                        className={`px-2 py-1.5 rounded text-[9px] font-semibold border transition-all cursor-pointer text-center ${
                          alignTarget === target
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner font-bold'
                            : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                        }`}
                      >
                        {target === 'selection' ? 'Selection Bounds' : 
                         target === 'canvas' ? 'Canvas Simulator' : 
                         target === 'first-selected' ? 'First Selected' : 'Last Selected'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#18181b] border border-[#232326] p-3.5 rounded-xl space-y-3.5">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Visual Alignment Grid</span>
                  <div className="grid grid-cols-3 gap-1.5 w-full max-w-[160px] mx-auto">
                    {[
                      { name: 'top-left', alignX: 'left', alignY: 'top', title: 'Top Left' },
                      { name: 'top-center', alignX: 'center-x', alignY: 'top', title: 'Top Center' },
                      { name: 'top-right', alignX: 'right', alignY: 'top', title: 'Top Right' },
                      { name: 'center-left', alignX: 'left', alignY: 'center-y', title: 'Center Left' },
                      { name: 'center', alignX: 'center-x', alignY: 'center-y', title: 'Center Middle' },
                      { name: 'center-right', alignX: 'right', alignY: 'center-y', title: 'Center Right' },
                      { name: 'bottom-left', alignX: 'left', alignY: 'bottom', title: 'Bottom Left' },
                      { name: 'bottom-center', alignX: 'center-x', alignY: 'bottom', title: 'Bottom Center' },
                      { name: 'bottom-right', alignX: 'right', alignY: 'bottom', title: 'Bottom Right' }
                    ].map((gridItem) => (
                      <button
                        key={gridItem.name}
                        onClick={() => handleGroupAlign([gridItem.alignX as any, gridItem.alignY as any])}
                        title={gridItem.title}
                        className="h-8.5 w-full rounded border border-[#2d2d31] bg-[#1b1b1d] hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#232326]/60">
                    <button
                      onClick={() => handleGroupAlign('center-x')}
                      className="px-2 py-1 bg-[#1b1b1d] hover:bg-indigo-600/20 border border-[#2d2d31] hover:border-indigo-500/50 rounded text-[9px] font-semibold text-slate-300 transition-colors cursor-pointer text-center"
                    >
                      Center Horiz
                    </button>
                    <button
                      onClick={() => handleGroupAlign('center-y')}
                      className="px-2 py-1 bg-[#1b1b1d] hover:bg-indigo-600/20 border border-[#2d2d31] hover:border-indigo-500/50 rounded text-[9px] font-semibold text-slate-300 transition-colors cursor-pointer text-center"
                    >
                      Center Vert
                    </button>
                  </div>
                </div>

                <div className="bg-[#18181b] border border-[#232326] p-3.5 rounded-xl space-y-3">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Distribute Actions</span>
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => handleGroupDistribute('horizontal')}
                      className="px-3 py-2 bg-[#1b1b1d] hover:bg-indigo-600/20 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-pointer text-center font-bold uppercase tracking-wider text-[10px]"
                    >
                      Distribute Horizontally
                    </button>
                    <button 
                      onClick={() => handleGroupDistribute('vertical')}
                      className="px-3 py-2 bg-[#1b1b1d] hover:bg-indigo-600/20 border border-[#2d2d31] hover:border-indigo-500/50 rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-pointer text-center font-bold uppercase tracking-wider text-[10px]"
                    >
                      Distribute Vertically
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !activeLayer ? (
            <div className="text-center text-[10px] text-slate-500 italic p-5">
              Selected layer not found.
            </div>
          ) : (
            /* STATE 3: Exactly One Layer Selected -> Edit activeLayer */
            <div className="space-y-5 h-full">
              
              {/* Header */}
              <div className="border-b border-[#232326] pb-3 space-y-2 flex-none">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Property Panel
                  </span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                    {activeLayer.type.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Layer Name:</label>
                  <input
                    type="text"
                    value={activeLayer.name}
                    onChange={(e) => updateActiveLayer({ name: e.target.value })}
                    onBlur={() => pushToHistory()}
                    className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Attributes Section */}
              <div className="space-y-4">
                
                {/* 1. LAYOUT POSITIONING */}
                <div className="bg-[#18181b] border border-[#232326] p-3 rounded-xl space-y-3">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Grid className="w-3 h-3" /> Layout Bounds (%)
                  </span>
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Position Top */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Top (Y):</span>
                        <span className="text-slate-200">{activeLayer.top}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" step="0.5"
                        value={activeLayer.top}
                        onChange={(e) => updateActiveLayer({ top: parseFloat(e.target.value) })}
                        onMouseUp={() => pushToHistory()}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>

                    {/* Position Left */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Left (X):</span>
                        <span className="text-slate-200">{activeLayer.left}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" step="0.5"
                        value={activeLayer.left}
                        onChange={(e) => updateActiveLayer({ left: parseFloat(e.target.value) })}
                        onMouseUp={() => pushToHistory()}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>

                    {/* Width */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Width (W):</span>
                        <span className="text-slate-200">{activeLayer.width}%</span>
                      </div>
                      <input
                        type="range" min="1" max="100" step="0.5"
                        value={activeLayer.width}
                        onChange={(e) => updateActiveLayer({ width: parseFloat(e.target.value) })}
                        onMouseUp={() => pushToHistory()}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>

                    {/* Height */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Height (H):</span>
                        <span className="text-slate-200">{activeLayer.height}%</span>
                      </div>
                      <input
                        type="range" min="1" max="100" step="0.5"
                        value={activeLayer.height}
                        onChange={(e) => updateActiveLayer({ height: parseFloat(e.target.value) })}
                        onMouseUp={() => pushToHistory()}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-[#232326]/60">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>Layer Opacity:</span>
                      <span className="text-slate-200">{Math.round(activeLayer.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={activeLayer.opacity}
                      onChange={(e) => updateActiveLayer({ opacity: parseFloat(e.target.value) })}
                      onMouseUp={() => pushToHistory()}
                      className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                    />
                  </div>

                  {/* Corner Radius rounding */}
                  {['color', 'gradient', 'animated-gradient', 'image', 'countdown'].includes(activeLayer.type) && (
                    <div className="space-y-1 pt-1.5 border-t border-[#232326]/60">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Corner Radius:</span>
                        <span className="text-slate-200">{activeLayer.borderRadius || 0}px</span>
                      </div>
                      <input
                        type="range" min="0" max="100" step="1"
                        value={activeLayer.borderRadius || 0}
                        onChange={(e) => updateActiveLayer({ borderRadius: parseInt(e.target.value) })}
                        onMouseUp={() => pushToHistory()}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Separate fill background opacity */}
                  {['color', 'gradient', 'animated-gradient'].includes(activeLayer.type) && (
                    <div className="space-y-1 pt-1.5 border-t border-[#232326]/60">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Inner Fill Opacity:</span>
                        <span className="text-slate-200">{Math.round((activeLayer.bgOpacity ?? 1) * 100)}%</span>
                      </div>
                      <input
                        type="range" min="0" max="1" step="0.05"
                        value={activeLayer.bgOpacity ?? 1}
                        onChange={(e) => updateActiveLayer({ bgOpacity: parseFloat(e.target.value) })}
                        onMouseUp={() => pushToHistory()}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Inner Padding config with slider and manual input */}
                  <div className="space-y-1.5 pt-1.5 border-t border-[#232326]/60">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>Inner Padding (Offset):</span>
                      <span className="text-slate-200 font-mono font-bold">{activeLayer.padding || 0}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min="0" max="80" step="1"
                        value={activeLayer.padding || 0}
                        onChange={(e) => updateActiveLayer({ padding: parseInt(e.target.value) || 0 })}
                        onMouseUp={() => pushToHistory()}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                      <input 
                        type="number" min="0" max="80"
                        value={activeLayer.padding || 0}
                        onChange={(e) => updateActiveLayer({ padding: parseInt(e.target.value) || 0 })}
                        onBlur={() => pushToHistory()}
                        className="w-10 bg-[#1b1b1d] border border-[#2d2d31] rounded px-1 py-0.5 text-[9px] text-slate-200 outline-none text-center font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Canvas Quick Align Shortcuts for single layer */}
                  <div className="pt-2.5 border-t border-[#232326]/60 space-y-2">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Canvas Quick Align Grid:</span>
                    <div className="grid grid-cols-3 gap-1 w-full max-w-[140px] mx-auto">
                      {[
                        { name: 'top-left', alignX: 'left', alignY: 'top', title: 'Top Left' },
                        { name: 'top-center', alignX: 'center-x', alignY: 'top', title: 'Top Center' },
                        { name: 'top-right', alignX: 'right', alignY: 'top', title: 'Top Right' },
                        { name: 'center-left', alignX: 'left', alignY: 'center-y', title: 'Center Left' },
                        { name: 'center', alignX: 'center-x', alignY: 'center-y', title: 'Center Middle' },
                        { name: 'center-right', alignX: 'right', alignY: 'center-y', title: 'Center Right' },
                        { name: 'bottom-left', alignX: 'left', alignY: 'bottom', title: 'Bottom Left' },
                        { name: 'bottom-center', alignX: 'center-x', alignY: 'bottom', title: 'Bottom Center' },
                        { name: 'bottom-right', alignX: 'right', alignY: 'bottom', title: 'Bottom Right' }
                      ].map((gridItem) => (
                        <button
                          key={gridItem.name}
                          onClick={() => handleGroupAlign([gridItem.alignX as any, gridItem.alignY as any], 'canvas')}
                          title={gridItem.title}
                          className="h-7 w-full rounded border border-[#2d2d31] bg-[#1b1b1d] hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Grid className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#232326]/60">
                      <button
                        onClick={() => handleGroupAlign('center-x', 'canvas')}
                        className="px-1.5 py-1 bg-[#1b1b1d] hover:bg-indigo-600/20 border border-[#2d2d31] hover:border-indigo-500/50 rounded text-[9px] font-semibold text-slate-300 transition-colors cursor-pointer text-center"
                      >
                        Center Horiz
                      </button>
                      <button
                        onClick={() => handleGroupAlign('center-y', 'canvas')}
                        className="px-1.5 py-1 bg-[#1b1b1d] hover:bg-indigo-600/20 border border-[#2d2d31] hover:border-indigo-500/50 rounded text-[9px] font-semibold text-slate-300 transition-colors cursor-pointer text-center"
                      >
                        Center Vert
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. BORDERS & STROKES */}
                {['color', 'gradient', 'animated-gradient', 'image', 'countdown'].includes(activeLayer.type) && (
                  <div className="bg-[#18181b] border border-[#232326] p-3.5 rounded-xl space-y-3.5">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Border & Stroke</span>
                    
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1.5 col-span-2">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Border Width (px):</span>
                          <span className="text-slate-200 font-mono font-bold">{activeLayer.borderWidth || 0}px</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range" min="0" max="40" step="1"
                            value={activeLayer.borderWidth || 0}
                            onChange={(e) => updateActiveLayer({ borderWidth: parseInt(e.target.value) || 0 })}
                            onMouseUp={() => pushToHistory()}
                            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                          />
                          <input 
                            type="number" min="0" max="40"
                            value={activeLayer.borderWidth || 0}
                            onChange={(e) => updateActiveLayer({ borderWidth: parseInt(e.target.value) || 0 })}
                            onBlur={() => pushToHistory()}
                            className="w-12 bg-[#1b1b1d] border border-[#2d2d31] rounded px-1.5 py-0.5 text-[10px] text-slate-200 outline-none text-center font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 col-span-2 pt-1 border-t border-[#232326]/40">
                        <span className="text-[9px] text-slate-400 font-semibold block uppercase">Border Position:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { updateActiveLayer({ borderType: 'inside' }, true); pushToHistory(); }}
                            className={`flex-1 py-1 text-[10px] font-semibold rounded border transition-colors cursor-pointer text-center ${
                              (activeLayer.borderType || 'inside') === 'inside'
                                ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                                : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                            }`}
                          >
                            Inside Bounds
                          </button>
                          <button
                            onClick={() => { updateActiveLayer({ borderType: 'outside' }, true); pushToHistory(); }}
                            className={`flex-1 py-1 text-[10px] font-semibold rounded border transition-colors cursor-pointer text-center ${
                              activeLayer.borderType === 'outside'
                                ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                                : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                            }`}
                          >
                            Outside Bounds
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 col-span-2 pt-1 border-t border-[#232326]/40">
                        <label className="text-[9px] text-slate-400 font-semibold block uppercase">Style:</label>
                        <select
                          value={activeLayer.borderStyle || 'solid'}
                          onChange={(e) => updateActiveLayer({ borderStyle: e.target.value as any }, true)}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded px-2.5 py-1.5 text-[10px] text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-400 font-semibold">Border Color:</label>
                        <input
                          type="color"
                          value={activeLayer.borderColor?.startsWith('#') ? activeLayer.borderColor : '#ffffff'}
                          onChange={(e) => updateActiveLayer({ borderColor: e.target.value })}
                          onBlur={() => pushToHistory()}
                          className="h-5 w-5 bg-transparent border-0 cursor-pointer p-0 rounded"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                          <span>Border Opacity:</span>
                          <span className="text-slate-200">{Math.round((activeLayer.borderOpacity ?? 1) * 100)}%</span>
                        </div>
                        <input
                          type="range" min="0" max="1" step="0.05"
                          value={activeLayer.borderOpacity ?? 1}
                          onChange={(e) => updateActiveLayer({ borderOpacity: parseFloat(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TEXT CUSTOMIZER */}
                {activeLayer.type === 'text' && (
                  <div className="space-y-4">
                    
                    {/* Content */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Text Content:</label>
                      <textarea
                        value={activeLayer.text || ''}
                        onChange={(e) => updateActiveLayer({ text: e.target.value })}
                        onBlur={() => pushToHistory()}
                        rows={2}
                        className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    {/* URL query params fetch */}
                    <div className="bg-[#18181b] border border-[#232326] p-3 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Fetch from Query params</span>
                        <button
                          onClick={() => updateActiveLayer({ fetchFromQuery: !activeLayer.fetchFromQuery }, true)}
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border transition-all cursor-pointer ${
                            activeLayer.fetchFromQuery 
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner' 
                              : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400'
                          }`}
                        >
                          {activeLayer.fetchFromQuery ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      {activeLayer.fetchFromQuery && (
                        <div className="space-y-1 animate-in slide-in-from-top-1 duration-150">
                          <label className="text-[9px] text-slate-400 font-semibold block uppercase">Query Param Name:</label>
                          <input
                            type="text"
                            value={activeLayer.queryParamName || ''}
                            onChange={(e) => updateActiveLayer({ queryParamName: e.target.value })}
                            placeholder="e.g. streamer"
                            onBlur={() => pushToHistory()}
                            className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                          />
                          <p className="text-[8px] text-slate-500 leading-normal pt-1">
                            If the viewer URL contains <code>?{activeLayer.queryParamName || 'param'}=value</code>, it overrides the text value.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bounding box Flex Placement */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Text Alignment Bounding Grid:</label>
                      <div className="grid grid-cols-3 gap-1 w-full max-w-[200px]">
                        {['top-left', 'top-center', 'top-right', 
                          'center-left', 'center', 'center-right', 
                          'bottom-left', 'bottom-center', 'bottom-right'].map((place) => (
                          <button
                            key={place}
                            onClick={() => updateActiveLayer({ textPlacement: place }, true)}
                            title={`Align ${place}`}
                            className={`h-6.5 w-full rounded border flex items-center justify-center transition-colors cursor-pointer ${
                              activeLayer.textPlacement === place 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner' 
                                : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-500 hover:text-white'
                            }`}
                          >
                            <Grid className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fonts Selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Font Family:</label>
                        <select
                          value={activeLayer.fontFamily || 'Inter'}
                          onChange={(e) => updateActiveLayer({ fontFamily: e.target.value }, true)}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-semibold"
                        >
                          {GOOGLE_FONTS_PRESETS.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Weight:</label>
                        <select
                          value={activeLayer.fontWeight || 'normal'}
                          onChange={(e) => updateActiveLayer({ fontWeight: e.target.value }, true)}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none"
                        >
                          <option value="100">Thin (100)</option>
                          <option value="300">Light (300)</option>
                          <option value="normal">Normal (400)</option>
                          <option value="500">Medium (500)</option>
                          <option value="bold">Bold (700)</option>
                          <option value="900">Black (900)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Font Size:</span>
                          <span>{activeLayer.fontSize || 24}px</span>
                        </div>
                        <input
                          type="range" min="8" max="120" step="1"
                          value={activeLayer.fontSize || 24}
                          onChange={(e) => updateActiveLayer({ fontSize: parseInt(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Letter Spacing:</span>
                          <span>{activeLayer.letterSpacing || 0}px</span>
                        </div>
                        <input
                          type="range" min="0" max="15" step="0.5"
                          value={activeLayer.letterSpacing || 0}
                          onChange={(e) => updateActiveLayer({ letterSpacing: parseFloat(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Transform Case and Color */}
                    <div className="grid grid-cols-2 gap-3 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Transform:</label>
                        <select
                          value={activeLayer.textTransform || 'none'}
                          onChange={(e) => updateActiveLayer({ textTransform: e.target.value }, true)}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none"
                        >
                          <option value="none">Normal</option>
                          <option value="uppercase">ALL-CAPS</option>
                          <option value="lowercase">all-lowercase</option>
                          <option value="capitalize">Capitalize</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Italics:</label>
                        <button
                          onClick={() => updateActiveLayer({ fontStyle: activeLayer.fontStyle === 'italic' ? 'normal' : 'italic' }, true)}
                          className={`w-full py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            activeLayer.fontStyle === 'italic'
                              ? 'bg-[#ec4899]/10 border-[#ec4899] text-[#ec4899]'
                              : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                          }`}
                        >
                          Italicize (<em>I</em>)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Text Color:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeLayer.color?.startsWith('#') ? activeLayer.color : '#ffffff'}
                          onChange={(e) => updateActiveLayer({ color: e.target.value })}
                          onBlur={() => pushToHistory()}
                          className="h-8 w-12 bg-transparent border-0 cursor-pointer p-0 rounded-lg"
                        />
                        <input
                          type="text"
                          value={activeLayer.color || '#ffffff'}
                          onChange={(e) => updateActiveLayer({ color: e.target.value })}
                          onBlur={() => pushToHistory()}
                          className="bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 w-32 font-mono"
                        />
                      </div>
                    </div>

                    {/* Neon glow slider */}
                    <div className="bg-[#18181b] border border-[#232326] p-3 rounded-xl space-y-3.5">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Neon Overlay Glows</span>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] text-slate-400 font-semibold">Outer Glow Color:</label>
                          <input
                            type="color"
                            value={activeLayer.outerGlowColor?.startsWith('#') ? activeLayer.outerGlowColor : '#ec4899'}
                            onChange={(e) => updateActiveLayer({ outerGlowColor: e.target.value })}
                            onBlur={() => pushToHistory()}
                            className="h-5 w-5 bg-transparent border-0 cursor-pointer p-0 rounded"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range" min="0" max="30" step="1"
                            value={activeLayer.outerGlowBlur || 0}
                            onChange={(e) => updateActiveLayer({ 
                              outerGlowBlur: parseInt(e.target.value),
                              outerGlowColor: activeLayer.outerGlowColor || '#ec4899'
                            })}
                            onMouseUp={() => pushToHistory()}
                            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                          />
                          <span className="text-[9px] text-slate-400 w-5 text-right">{activeLayer.outerGlowBlur || 0}px</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] text-slate-400 font-semibold">Outline / Inner Glow:</label>
                          <input
                            type="color"
                            value={activeLayer.innerGlowColor?.startsWith('#') ? activeLayer.innerGlowColor : '#ffffff'}
                            onChange={(e) => updateActiveLayer({ innerGlowColor: e.target.value })}
                            onBlur={() => pushToHistory()}
                            className="h-5 w-5 bg-transparent border-0 cursor-pointer p-0 rounded"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range" min="0" max="12" step="0.5"
                            value={activeLayer.innerGlowBlur || 0}
                            onChange={(e) => updateActiveLayer({ 
                              innerGlowBlur: parseFloat(e.target.value),
                              innerGlowColor: activeLayer.innerGlowColor || '#ffffff'
                            })}
                            onMouseUp={() => pushToHistory()}
                            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                          />
                          <span className="text-[9px] text-slate-400 w-5 text-right">{activeLayer.innerGlowBlur || 0}px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SOLID COLOR CONTROLS */}
                {activeLayer.type === 'color' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Background Color:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeLayer.bgColor?.startsWith('#') ? activeLayer.bgColor : '#6366f1'}
                          onChange={(e) => updateActiveLayer({ bgColor: e.target.value })}
                          onBlur={() => pushToHistory()}
                          className="h-8 w-12 bg-transparent border-0 cursor-pointer p-0 rounded-lg"
                        />
                        <input
                          type="text"
                          value={activeLayer.bgColor || ''}
                          onChange={(e) => updateActiveLayer({ bgColor: e.target.value })}
                          onBlur={() => pushToHistory()}
                          placeholder="e.g. rgba(99,102,241,0.6)"
                          className="bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 w-full font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Default Colors:</label>
                      <div className="flex flex-wrap gap-2">
                        {['#6366f1', '#ec4899', '#10b981', '#3b82f6', 'rgba(0,0,0,0.8)', 'rgba(30,30,34,0.9)'].map((col) => (
                          <button
                            key={col}
                            onClick={() => updateActiveLayer({ bgColor: col }, true)}
                            className="h-6.5 w-6.5 rounded border border-[#2d2d31] transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. STATIC GRADIENT CONTROLS */}
                {activeLayer.type === 'gradient' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Gradient Type:</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateActiveLayer({ gradientType: 'linear' }, true)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            activeLayer.gradientType === 'linear'
                              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200'
                              : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                          }`}
                        >
                          Linear Flow
                        </button>
                        <button
                          onClick={() => updateActiveLayer({ gradientType: 'radial' }, true)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            activeLayer.gradientType === 'radial'
                              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200'
                              : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                          }`}
                        >
                          Radial glow
                        </button>
                      </div>
                    </div>

                    {activeLayer.gradientType === 'linear' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Angle (°):</span>
                          <span>{activeLayer.gradientAngle || 90}°</span>
                        </div>
                        <input
                          type="range" min="0" max="360" step="5"
                          value={activeLayer.gradientAngle || 90}
                          onChange={(e) => updateActiveLayer({ gradientAngle: parseInt(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Gradient Stops Manager */}
                    <div className="space-y-3 bg-[#18181b] border border-[#232326] p-3 rounded-xl">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Gradient Stops</span>
                        <button
                          onClick={() => { handleGradientAddStop(); pushToHistory(); }}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" /> Add Stop
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {(activeLayer.gradientColors || []).map((color, idx) => {
                          const stops = activeLayer.gradientStops || [];
                          const stopVal = stops[idx] !== undefined 
                            ? stops[idx] 
                            : Math.round((idx / (activeLayer.gradientColors!.length - 1)) * 100);
                          
                          return (
                            <div key={idx} className="flex items-center gap-2 border border-[#28282b] bg-[#101012] p-2 rounded-lg">
                              {/* Color circle native picker */}
                              <div className="flex-shrink-0 flex items-center gap-1.5">
                                <input
                                  type="color"
                                  value={color.startsWith('#') ? color : '#ffffff'}
                                  onChange={(e) => handleGradientStopColorChange(idx, e.target.value)}
                                  onBlur={() => pushToHistory()}
                                  className="h-6 w-6 bg-transparent border-0 cursor-pointer p-0 rounded-full"
                                />
                                <span className="text-[9px] font-mono text-slate-400 select-all">{color}</span>
                              </div>

                              {/* Stop slider percentage */}
                              <div className="flex-1 space-y-0.5 min-w-0">
                                <div className="flex justify-between text-[9px] text-slate-400 font-semibold leading-none">
                                  <span>Step:</span>
                                  <span className="text-indigo-400 font-bold">{stopVal}%</span>
                                </div>
                                <input
                                  type="range" min="0" max="100" step="1"
                                  value={stopVal}
                                  onChange={(e) => handleGradientStopPercentChange(idx, parseInt(e.target.value))}
                                  onMouseUp={() => pushToHistory()}
                                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                                />
                              </div>

                              {/* Remove stop circle trigger */}
                              <button
                                onClick={() => { handleGradientRemoveStop(idx); pushToHistory(); }}
                                disabled={(activeLayer.gradientColors || []).length <= 2}
                                className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                title="Remove stop"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. ANIMATED GRADIENT CONTROLS */}
                {activeLayer.type === 'animated-gradient' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Base Shape:</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateActiveLayer({ gradientType: 'linear' }, true)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            activeLayer.gradientType === 'linear'
                              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200'
                              : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                          }`}
                        >
                          Linear
                        </button>
                        <button
                          onClick={() => updateActiveLayer({ gradientType: 'radial' }, true)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            activeLayer.gradientType === 'radial'
                              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200'
                              : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                          }`}
                        >
                          Radial
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Animation Flow Type:</label>
                      <select
                        value={activeLayer.animationType || 'shift'}
                        onChange={(e) => updateActiveLayer({ animationType: e.target.value as any }, true)}
                        className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none font-semibold focus:border-indigo-500"
                      >
                        <option value="shift">Shift (Flowing Colors)</option>
                        <option value="rotate">Rotate Hue Phase</option>
                        <option value="wave">Oscillating Waves</option>
                      </select>
                    </div>

                    {/* Custom animation curves selector */}
                    <div className="bg-[#18181b] border border-[#232326] p-3 rounded-xl space-y-3">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Animation timing function</span>
                      
                      <div className="space-y-2">
                        <select
                          value={activeLayer.animationTimingFunction || 'ease-in-out'}
                          onChange={(e) => updateActiveLayer({ animationTimingFunction: e.target.value }, true)}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                        >
                          <option value="linear">Linear Flow (linear)</option>
                          <option value="ease-in-out">Ease In Out (ease-in-out)</option>
                          <option value="cubic-bezier(0.68, -0.6, 0.32, 1.6)">Hyper Elastic Bounce</option>
                          <option value="cubic-bezier(0.87, 0, 0.13, 1)">Aggressive Pulse</option>
                        </select>
                      </div>

                      {/* Render visual graph SVG */}
                      {(() => {
                        const presets = {
                          'linear': { x1: 0, y1: 0, x2: 1, y2: 1 },
                          'ease-in-out': { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },
                          'cubic-bezier(0.68, -0.6, 0.32, 1.6)': { x1: 0.68, y1: -0.6, x2: 0.32, y2: 1.6 },
                          'cubic-bezier(0.87, 0, 0.13, 1)': { x1: 0.87, y1: 0, x2: 0.13, y2: 1 }
                        };
                        const currentCurve = activeLayer.animationTimingFunction || 'ease-in-out';
                        const curve = presets[currentCurve as keyof typeof presets] || presets['ease-in-out'];

                        // Draw SVG cubic bezier
                        const cx1 = 15 + curve.x1 * 70;
                        const cy1 = 85 - curve.y1 * 70;
                        const cx2 = 15 + curve.x2 * 70;
                        const cy2 = 85 - curve.y2 * 70;

                        return (
                          <div className="flex flex-col items-center pt-2">
                            <div className="relative h-28 w-28 bg-[#101012] border border-[#2d2d31] rounded-lg overflow-hidden flex items-center justify-center">
                              <svg className="h-full w-full" viewBox="0 0 100 100">
                                {/* Grid lines */}
                                <line x1="15" y1="15" x2="85" y2="15" stroke="#252528" strokeWidth="0.5" strokeDasharray="2" />
                                <line x1="15" y1="85" x2="85" y2="85" stroke="#252528" strokeWidth="0.5" strokeDasharray="2" />
                                <line x1="15" y1="15" x2="15" y2="85" stroke="#252528" strokeWidth="0.5" strokeDasharray="2" />
                                <line x1="85" y1="15" x2="85" y2="85" stroke="#252528" strokeWidth="0.5" strokeDasharray="2" />
                                
                                {/* Bezier Curve path */}
                                <path 
                                  d={`M 15 85 C ${cx1} ${cy1}, ${cx2} ${cy2}, 85 15`} 
                                  fill="none" 
                                  stroke="#6366f1" 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round"
                                />

                                {/* Anchor points */}
                                <circle cx="15" cy="85" r="3.5" fill="#ec4899" />
                                <circle cx="85" cy="15" r="3.5" fill="#ec4899" />
                                
                                {/* Handle lines */}
                                <line x1="15" y1="85" x2={cx1} y2={cy1} stroke="rgba(236,72,153,0.4)" strokeWidth="1" strokeDasharray="1" />
                                <line x1="85" y1="15" x2={cx2} y2={cy2} stroke="rgba(236,72,153,0.4)" strokeWidth="1" strokeDasharray="1" />
                                <circle cx={cx1} cy={cy1} r="2.5" fill="#ec4899" />
                                <circle cx={cx2} cy={cy2} r="2.5" fill="#ec4899" />
                              </svg>
                              <span className="absolute bottom-1 right-1.5 text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none pointer-events-none">TIMING GRAPH</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {activeLayer.gradientType === 'linear' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                            <span>Angle:</span>
                            <span>{activeLayer.gradientAngle || 90}°</span>
                          </div>
                          <input
                            type="range" min="0" max="360" step="5"
                            value={activeLayer.gradientAngle || 90}
                            onChange={(e) => updateActiveLayer({ gradientAngle: parseInt(e.target.value) })}
                            onMouseUp={() => pushToHistory()}
                            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Speed:</span>
                          <span>{activeLayer.animationSpeed || 8}s</span>
                        </div>
                        <input
                          type="range" min="1" max="30" step="0.5"
                          value={activeLayer.animationSpeed || 8}
                          onChange={(e) => updateActiveLayer({ animationSpeed: parseFloat(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Gradient Stops Manager */}
                    <div className="space-y-3 bg-[#18181b] border border-[#232326] p-3 rounded-xl">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Animated Stops</span>
                        <button
                          onClick={() => { handleGradientAddStop(); pushToHistory(); }}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" /> Add Stop
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {(activeLayer.gradientColors || []).map((color, idx) => {
                          const stops = activeLayer.gradientStops || [];
                          const stopVal = stops[idx] !== undefined 
                            ? stops[idx] 
                            : Math.round((idx / (activeLayer.gradientColors!.length - 1)) * 100);
                          
                          return (
                            <div key={idx} className="flex items-center gap-2 border border-[#28282b] bg-[#101012] p-2 rounded-lg">
                              {/* Color native picker */}
                              <div className="flex-shrink-0 flex items-center gap-1.5">
                                <input
                                  type="color"
                                  value={color.startsWith('#') ? color : '#ffffff'}
                                  onChange={(e) => handleGradientStopColorChange(idx, e.target.value)}
                                  onBlur={() => pushToHistory()}
                                  className="h-6 w-6 bg-transparent border-0 cursor-pointer p-0 rounded-full"
                                />
                                <span className="text-[9px] font-mono text-slate-400 select-all">{color}</span>
                              </div>

                              {/* Stop slider percentage */}
                              <div className="flex-1 space-y-0.5 min-w-0">
                                <div className="flex justify-between text-[9px] text-slate-400 font-semibold leading-none">
                                  <span>Step:</span>
                                  <span className="text-indigo-400 font-bold">{stopVal}%</span>
                                </div>
                                <input
                                  type="range" min="0" max="100" step="1"
                                  value={stopVal}
                                  onChange={(e) => handleGradientStopPercentChange(idx, parseInt(e.target.value))}
                                  onMouseUp={() => pushToHistory()}
                                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                                />
                              </div>

                              {/* Remove stop circle trigger */}
                              <button
                                onClick={() => { handleGradientRemoveStop(idx); pushToHistory(); }}
                                disabled={(activeLayer.gradientColors || []).length <= 2}
                                className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                title="Remove stop"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. IMAGE CONTROLS */}
                {activeLayer.type === 'image' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Image Source Link (URL):</label>
                      <input
                        type="text"
                        value={activeLayer.imageUrl || ''}
                        onChange={(e) => updateActiveLayer({ imageUrl: e.target.value })}
                        onBlur={() => pushToHistory()}
                        placeholder="Paste image url..."
                        className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Object Fit:</label>
                      <select
                        value={activeLayer.objectFit || 'cover'}
                        onChange={(e) => updateActiveLayer({ objectFit: e.target.value as any }, true)}
                        className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                      >
                        <option value="cover">Cover (Aspect Crop)</option>
                        <option value="contain">Contain (Letterbox)</option>
                        <option value="fill">Fill (Stretched)</option>
                        <option value="none">None (Actual Size)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Presets:</label>
                      <div className="flex flex-col gap-1.5">
                        {QUICK_IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => updateActiveLayer({ imageUrl: preset.url }, true)}
                            className="w-full py-1 text-left px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold rounded truncate cursor-pointer"
                            title={preset.name}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. COUNTDOWN TIMER CONTROLS */}
                {activeLayer.type === 'countdown' && (
                  <div className="space-y-4">
                    <div className="space-y-2.5 bg-[#18181b] border border-[#232326] p-3 rounded-xl">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Duration Controls</span>
                      
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Timer Duration:</span>
                        <span className="text-slate-200 font-mono font-bold">{activeLayer.countdownDuration || 300}s</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="range" min="10" max="3600" step="10"
                          value={activeLayer.countdownDuration || 300}
                          onChange={(e) => updateActiveLayer({ countdownDuration: parseInt(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                        <input 
                          type="number" min="5" max="7200"
                          value={activeLayer.countdownDuration || 300}
                          onChange={(e) => updateActiveLayer({ countdownDuration: parseInt(e.target.value) || 0 })}
                          onBlur={() => pushToHistory()}
                          className="w-14 bg-[#1b1b1d] border border-[#2d2d31] rounded px-1.5 py-0.5 text-[10px] text-slate-200 outline-none text-center font-mono font-bold"
                        />
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-[#232326]/60">
                        <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Quick Presets:</span>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { name: '10s', value: 10 },
                            { name: '30s', value: 30 },
                            { name: '1m', value: 60 },
                            { name: '2m', value: 120 },
                            { name: '5m', value: 300 },
                            { name: '10m', value: 600 }
                          ].map(stop => (
                            <button
                              key={stop.value}
                              onClick={() => {
                                updateActiveLayer({ countdownDuration: stop.value });
                                pushToHistory();
                              }}
                              className={`px-1 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer text-center ${
                                (activeLayer.countdownDuration || 300) === stop.value
                                  ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                                  : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400 hover:text-white'
                              }`}
                            >
                              {stop.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Font Family selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Font Family:</label>
                        <select
                          value={activeLayer.fontFamily || 'Orbitron'}
                          onChange={(e) => updateActiveLayer({ fontFamily: e.target.value }, true)}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-semibold"
                        >
                          {GOOGLE_FONTS_PRESETS.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Weight:</label>
                        <select
                          value={activeLayer.fontWeight || 'bold'}
                          onChange={(e) => updateActiveLayer({ fontWeight: e.target.value }, true)}
                          className="w-full bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none font-semibold"
                        >
                          <option value="100">Thin (100)</option>
                          <option value="300">Light (300)</option>
                          <option value="normal">Normal (400)</option>
                          <option value="bold">Bold (700)</option>
                          <option value="900">Black (900)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Font Size:</span>
                          <span>{activeLayer.fontSize || 32}px</span>
                        </div>
                        <input
                          type="range" min="8" max="120" step="1"
                          value={activeLayer.fontSize || 32}
                          onChange={(e) => updateActiveLayer({ fontSize: parseInt(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Letter Spacing:</span>
                          <span>{activeLayer.letterSpacing || 0}px</span>
                        </div>
                        <input
                          type="range" min="0" max="15" step="0.5"
                          value={activeLayer.letterSpacing || 0}
                          onChange={(e) => updateActiveLayer({ letterSpacing: parseFloat(e.target.value) })}
                          onMouseUp={() => pushToHistory()}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Timer Bounding Alignment:</label>
                      <div className="grid grid-cols-3 gap-1 w-full max-w-[200px]">
                        {['top-left', 'top-center', 'top-right', 
                          'center-left', 'center', 'center-right', 
                          'bottom-left', 'bottom-center', 'bottom-right'].map((place) => (
                          <button
                            key={place}
                            onClick={() => updateActiveLayer({ textPlacement: place }, true)}
                            title={`Align ${place}`}
                            className={`h-6.5 w-full rounded border flex items-center justify-center transition-colors cursor-pointer ${
                              activeLayer.textPlacement === place 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner' 
                                : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-500 hover:text-white'
                            }`}
                          >
                            <Grid className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Timer Color:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeLayer.color?.startsWith('#') ? activeLayer.color : '#ffffff'}
                          onChange={(e) => updateActiveLayer({ color: e.target.value })}
                          onBlur={() => pushToHistory()}
                          className="h-8 w-12 bg-transparent border-0 cursor-pointer p-0 rounded-lg"
                        />
                        <input
                          type="text"
                          value={activeLayer.color || '#ffffff'}
                          onChange={(e) => updateActiveLayer({ color: e.target.value })}
                          onBlur={() => pushToHistory()}
                          className="bg-[#1b1b1d] border border-[#2d2d31] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 w-32 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. SHADOW CONFIGURATIONS */}
                <div className="bg-[#18181b] border border-[#232326] p-3 rounded-xl space-y-2.5">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Shadow configs</span>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Color:</span>
                      <input
                        type="color"
                        value={activeLayer.shadowColor?.startsWith('#') ? activeLayer.shadowColor : '#000000'}
                        onChange={(e) => updateActiveLayer({ shadowColor: e.target.value })}
                        onBlur={() => pushToHistory()}
                        className="h-5 w-6 bg-transparent border-0 cursor-pointer p-0 rounded"
                      />
                      <button
                        onClick={() => updateActiveLayer({ shadowColor: undefined }, true)}
                        className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded hover:text-white cursor-pointer"
                      >
                        Off
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">Blur:</span>
                      <input
                        type="number" min="0" max="100"
                        value={activeLayer.shadowBlur ?? 12}
                        onChange={(e) => updateActiveLayer({ shadowBlur: parseInt(e.target.value) || 0 })}
                        onBlur={() => pushToHistory()}
                        className="bg-[#1b1b1d] border border-[#2d2d31] rounded px-1 py-0.5 text-[10px] text-slate-200 outline-none w-10 text-center"
                      />
                    </div>
                  </div>

                  {/* Spread and Inset for non-text layers */}
                  {['color', 'gradient', 'animated-gradient', 'image', 'countdown'].includes(activeLayer.type) && (
                    <div className="space-y-2.5 pt-2 border-t border-[#232326]/60">
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">Spread:</span>
                          <input
                            type="number" min="0" max="100"
                            value={activeLayer.shadowSpread ?? 0}
                            onChange={(e) => updateActiveLayer({ shadowSpread: parseInt(e.target.value) || 0 })}
                            onBlur={() => pushToHistory()}
                            className="bg-[#1b1b1d] border border-[#2d2d31] rounded px-1.5 py-0.5 text-[10px] text-slate-200 outline-none w-10 text-center"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Inset:</span>
                          <button
                            onClick={() => updateActiveLayer({ shadowInset: !activeLayer.shadowInset }, true)}
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border transition-all cursor-pointer ${
                              activeLayer.shadowInset 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner' 
                                : 'bg-[#1b1b1d] border-[#2d2d31] text-slate-400'
                            }`}
                          >
                            {activeLayer.shadowInset ? 'On' : 'Off'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
