import type { CSSProperties } from 'react';
import { AppTheme, FilterSettings } from '../types';

export const THEMES: { id: AppTheme; name: string; description: string; previewBg: string; previewAccent: string; previewBorder: string }[] = [
  {
    id: 'white-blue',
    name: 'White & Blue',
    description: 'Crisp gallery white with vibrant cobalt and royal blue accents.',
    previewBg: 'bg-white',
    previewAccent: 'bg-blue-600',
    previewBorder: 'border-blue-200',
  },
  {
    id: 'blue-black',
    name: 'Blue & Black',
    description: 'Obsidian midnight black with electric cyan and neon blue luminescence.',
    previewBg: 'bg-[#060A14]',
    previewAccent: 'bg-cyan-400',
    previewBorder: 'border-cyan-800',
  },
  {
    id: 'white-black',
    name: 'White & Black',
    description: 'Timeless high-fashion editorial monochrome and museum paper textures.',
    previewBg: 'bg-[#FDFCFB]',
    previewAccent: 'bg-[#1A1A1A]',
    previewBorder: 'border-neutral-300',
  },
];

export const THEME_STYLES: Record<
  AppTheme,
  {
    rootBg: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    headerBg: string;
    headerBorder: string;
    accentBg: string;
    accentHover: string;
    accentText: string;
    accentBorder: string;
    activeTabIndicator: string;
    badgeBg: string;
    badgeText: string;
    inputBg: string;
    modalBg: string;
  }
> = {
  'white-blue': {
    rootBg: 'bg-slate-50',
    cardBg: 'bg-white',
    cardBorder: 'border-blue-100',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    headerBg: 'bg-white/95',
    headerBorder: 'border-blue-100/80',
    accentBg: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    accentText: 'text-blue-600',
    accentBorder: 'border-blue-500',
    activeTabIndicator: 'text-blue-600 underline font-bold decoration-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-600',
    inputBg: 'bg-slate-50 border-blue-100 text-slate-900',
    modalBg: 'bg-white text-slate-900 border-blue-100',
  },
  'blue-black': {
    rootBg: 'bg-[#060A14]',
    cardBg: 'bg-[#0B1222]',
    cardBorder: 'border-cyan-950/60',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',
    headerBg: 'bg-[#060A14]/95',
    headerBorder: 'border-cyan-900/40',
    accentBg: 'bg-cyan-500 text-black',
    accentHover: 'hover:bg-cyan-400',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500',
    activeTabIndicator: 'text-cyan-400 underline font-bold decoration-cyan-400',
    badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    badgeText: 'text-cyan-400',
    inputBg: 'bg-[#0D1527] border-cyan-900/50 text-slate-100',
    modalBg: 'bg-[#0B1222] text-slate-100 border-cyan-900/60',
  },
  'white-black': {
    rootBg: 'bg-[#FDFCFB]',
    cardBg: 'bg-white',
    cardBorder: 'border-[#1A1A1A]/10',
    textPrimary: 'text-[#1A1A1A]',
    textSecondary: 'text-[#1A1A1A]/70',
    textMuted: 'text-[#1A1A1A]/40',
    headerBg: 'bg-[#FDFCFB]/95',
    headerBorder: 'border-[#1A1A1A]/10',
    accentBg: 'bg-[#1A1A1A] text-white',
    accentHover: 'hover:bg-black',
    accentText: 'text-[#1A1A1A]',
    accentBorder: 'border-[#1A1A1A]',
    activeTabIndicator: 'text-[#1A1A1A] underline font-bold decoration-[#1A1A1A]',
    badgeBg: 'bg-[#1A1A1A]/5 text-[#1A1A1A] border-[#1A1A1A]/15',
    badgeText: 'text-[#1A1A1A]',
    inputBg: 'bg-[#FAF9F6] border-[#1A1A1A]/15 text-[#1A1A1A]',
    modalBg: 'bg-[#FDFCFB] text-[#1A1A1A] border-[#1A1A1A]/15',
  },
};

// Preset filters list for photo editing
export const PHOTO_FILTER_PRESETS = [
  { id: 'normal', name: 'Original', css: 'none', previewColor: 'from-neutral-200 to-neutral-400' },
  { id: 'cyber-blue', name: 'Cyber Blue', css: 'contrast(120%) saturate(140%) hue-rotate(185deg)', previewColor: 'from-blue-500 to-cyan-400' },
  { id: 'grayscale', name: '35mm B&W', css: 'grayscale(100%) contrast(120%)', previewColor: 'from-neutral-400 to-black' },
  { id: 'sepia', name: 'Sepia Noir', css: 'sepia(80%) contrast(110%) brightness(95%)', previewColor: 'from-amber-600 to-amber-900' },
  { id: 'vintage', name: 'Golden Hour', css: 'sepia(30%) saturate(150%) brightness(105%)', previewColor: 'from-amber-400 to-rose-400' },
  { id: 'noir', name: 'Deep Noir', css: 'grayscale(100%) contrast(170%) brightness(85%)', previewColor: 'from-neutral-700 to-black' },
  { id: 'cyanotype', name: 'Cyanotype', css: 'grayscale(100%) sepia(40%) hue-rotate(180deg) saturate(280%)', previewColor: 'from-blue-600 to-indigo-900' },
  { id: 'emerald', name: 'Emerald', css: 'hue-rotate(55deg) saturate(125%) contrast(105%)', previewColor: 'from-emerald-500 to-teal-800' },
  { id: 'matte', name: 'Matte Film', css: 'contrast(90%) brightness(110%) saturate(85%)', previewColor: 'from-stone-300 to-stone-500' },
];

/**
 * Computes the inline CSS filter string from the preset name and custom darkroom sliders.
 */
export function getPhotoFilterStyle(filterName?: string, settings?: FilterSettings): CSSProperties {
  const parts: string[] = [];

  // 1. Preset filter basis
  const preset = PHOTO_FILTER_PRESETS.find((p) => p.id === filterName);
  if (preset && preset.css !== 'none') {
    parts.push(preset.css);
  }

  // 2. Custom fine-tuning sliders if provided
  if (settings) {
    if (settings.brightness !== undefined && settings.brightness !== 100) {
      parts.push(`brightness(${settings.brightness}%)`);
    }
    if (settings.contrast !== undefined && settings.contrast !== 100) {
      parts.push(`contrast(${settings.contrast}%)`);
    }
    if (settings.saturation !== undefined && settings.saturation !== 100) {
      parts.push(`saturate(${settings.saturation}%)`);
    }
    if (settings.sepia !== undefined && settings.sepia > 0) {
      parts.push(`sepia(${settings.sepia}%)`);
    }
    if (settings.blur !== undefined && settings.blur > 0) {
      parts.push(`blur(${settings.blur}px)`);
    }
    if (settings.hueRotate !== undefined && settings.hueRotate > 0) {
      parts.push(`hue-rotate(${settings.hueRotate}deg)`);
    }
  }

  return parts.length > 0 ? { filter: parts.join(' ') } : {};
}
