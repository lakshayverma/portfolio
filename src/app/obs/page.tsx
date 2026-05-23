"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

function OBSViewerContent() {
  const searchParams = useSearchParams();
  const sourceId = searchParams.get('sourceId') || 'gaming-hud'; // Default fallback
  const [scene, setScene] = useState<OBSScene | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Poll API for updates every 1.5s (OBS live-sync)
  useEffect(() => {
    let active = true;

    async function fetchScene() {
      try {
        const res = await fetch(`/api/obs/scenes?id=${sourceId}`);
        if (!res.ok) {
          throw new Error(`Scene not found (${res.status})`);
        }
        const data = await res.json();
        if (active) {
          setScene(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message);
        }
      }
    }

    fetchScene();
    const interval = setInterval(fetchScene, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [sourceId]);

  // Dynamically load Google Fonts needed for text layers
  useEffect(() => {
    if (!scene) return;
    const fonts = scene.layers
      .filter(l => l.type === 'text' && l.fontFamily)
      .map(l => l.fontFamily as string);
    
    const uniqueFonts = [...new Set(fonts)];
    if (uniqueFonts.length > 0) {
      const fontQuery = uniqueFonts.map(f => f.replace(/\s+/g, '+')).join('|');
      const linkId = 'obs-google-fonts';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css?family=${fontQuery}:100,200,300,400,500,600,700,800,900,100i,200i,300i,400i,500i,600i,700i,800i,900i&display=swap`;
    }
  }, [scene]);

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

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#131314]/90 text-red-400 p-6 font-mono text-center">
        <h2 className="text-xl font-bold mb-2">OBS Scene Load Error</h2>
        <p className="text-sm opacity-80">{error}</p>
        <p className="text-xs mt-4 opacity-50">Please verify that sourceId "{sourceId}" exists and your server is running.</p>
      </div>
    );
  }

  if (!scene) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-transparent text-indigo-400 font-mono text-xs tracking-widest uppercase">
        Connecting to Scene Source...
      </div>
    );
  }

  // Sort layers by zIndex
  const sortedLayers = [...scene.layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent select-none">
      {/* GPU Accelerated Gradient Animation Keyframes */}
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
      `}</style>

      {sortedLayers.map((layer) => {
        if (!layer.visible) return null;

        // Custom Shadow configurations
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

        const baseStyle: React.CSSProperties = {
          position: 'absolute',
          top: `${layer.top}%`,
          left: `${layer.left}%`,
          width: `${layer.width}%`,
          height: `${layer.height}%`,
          zIndex: layer.zIndex,
          opacity: layer.opacity,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          ...borderStyleObj
        };

        // 1. Color Layer
        if (layer.type === 'color') {
          return (
            <div
              key={layer.id}
              style={{
                ...baseStyle,
                backgroundColor: layer.bgColor ? toRGBA(layer.bgColor, layer.bgOpacity ?? 1) : 'rgba(0, 0, 0, 0.5)'
              }}
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

          return (
            <div
              key={layer.id}
              style={{
                ...baseStyle,
                backgroundImage: bg
              }}
            />
          );
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

          return (
            <div
              key={layer.id}
              style={{
                ...baseStyle,
                backgroundImage,
                backgroundSize,
                animation
              }}
            />
          );
        }

        // 4. Image Layer
        if (layer.type === 'image') {
          return (
            <div key={layer.id} style={baseStyle}>
              {layer.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={layer.imageUrl}
                  alt={layer.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: layer.objectFit || 'cover'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-500/20 text-white/50 text-[10px]">
                  No Image URL Provided
                </div>
              )}
            </div>
          );
        }

        // 5. Text Layer
        if (layer.type === 'text') {
          const { justifyContent, alignItems, textAlign } = getPlacementStyles(layer.textPlacement);

          // Build Text Shadow and Filters for Shadows & Glows
          let textShadow = '';
          const filterParts: string[] = [];

          // Core drop shadow
          if (layer.shadowColor) {
            const sx = layer.shadowOffset?.x ?? 2;
            const sy = layer.shadowOffset?.y ?? 2;
            const sb = layer.shadowBlur ?? 4;
            textShadow = `${sx}px ${sy}px ${sb}px ${layer.shadowColor}`;
          }

          // Outer Glow
          if (layer.outerGlowColor) {
            filterParts.push(`drop-shadow(0 0 ${layer.outerGlowBlur || 8}px ${layer.outerGlowColor})`);
          }

          // Inner Glow
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
          if (layer.fetchFromQuery && layer.queryParamName) {
            const queryVal = searchParams.get(layer.queryParamName);
            if (queryVal !== null) {
              displayText = queryVal;
            }
          }

          return (
            <div
              key={layer.id}
              style={{
                ...baseStyle,
                display: 'flex',
                justifyContent,
                alignItems
              }}
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

          return (
            <div key={layer.id} style={baseStyle}>
              <CountdownTimer
                duration={layer.countdownDuration || 300}
                style={textStyle}
                textPlacement={layer.textPlacement}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default function OBSViewerPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-transparent text-indigo-400 font-mono text-xs tracking-widest">
        Initializing Overlay View...
      </div>
    }>
      <OBSViewerContent />
    </Suspense>
  );
}
