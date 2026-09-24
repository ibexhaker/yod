import React, { useState } from 'react';
import { Post, FilterSettings } from '../types';
import { PHOTO_FILTER_PRESETS, getPhotoFilterStyle, THEME_STYLES } from '../utils/theme';
import { sound } from '../utils/audio';
import {
  X,
  Sliders,
  Sparkles,
  MapPin,
  Tag,
  Camera,
  Check,
  RotateCcw,
  Eye,
  Info,
} from 'lucide-react';

interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPost: Post) => void;
  theme?: 'white-blue' | 'blue-black' | 'white-black';
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  isOpen,
  onClose,
  onSave,
  theme = 'white-blue',
}) => {
  if (!isOpen || !post) return null;

  const currentTheme = THEME_STYLES[theme];

  // Post states
  const [activeTab, setActiveTab] = useState<'filters' | 'adjust' | 'metadata'>('filters');
  const [selectedFilter, setSelectedFilter] = useState<string>(post.filter || 'normal');
  const [filterSettings, setFilterSettings] = useState<FilterSettings>(
    post.filterSettings || {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      blur: 0,
      hueRotate: 0,
    }
  );
  const [caption, setCaption] = useState<string>(post.caption || '');
  const [location, setLocation] = useState<string>(post.location || '');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [exifCamera, setExifCamera] = useState<string>(post.exif?.camera || '');
  const [exifLens, setExifLens] = useState<string>(post.exif?.lens || '');
  const [exifAperture, setExifAperture] = useState<string>(post.exif?.aperture || '');
  const [exifShutter, setExifShutter] = useState<string>(post.exif?.shutter || '');
  const [exifIso, setExifIso] = useState<string>(String(post.exif?.iso || ''));

  const handleResetSliders = () => {
    sound.playPop();
    setFilterSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      blur: 0,
      hueRotate: 0,
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(`#${trimmed}`)) {
        sound.playPop();
        setTags([...tags, `#${trimmed}`]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    sound.playPop();
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    sound.playCameraShutter();
    const updated: Post = {
      ...post,
      caption,
      location: location.trim() || undefined,
      filter: selectedFilter,
      filterSettings,
      tags,
      exif: {
        camera: exifCamera.trim() || undefined,
        lens: exifLens.trim() || undefined,
        aperture: exifAperture.trim() || undefined,
        shutter: exifShutter.trim() || undefined,
        iso: exifIso.trim() ? Number(exifIso) || exifIso : undefined,
      },
    };
    onSave(updated);
    onClose();
  };

  const filterStyle = getPhotoFilterStyle(selectedFilter, filterSettings);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        className={`w-full max-w-4xl ${currentTheme.modalBg} border shadow-2xl rounded-2xl overflow-hidden my-auto flex flex-col md:flex-row max-h-[90vh]`}
      >
        {/* Left Side: Live Photo Preview */}
        <div className="w-full md:w-1/2 bg-black flex flex-col justify-center items-center relative overflow-hidden shrink-0 min-h-[300px] md:min-h-[480px]">
          <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sans uppercase font-bold text-white tracking-widest flex items-center gap-1.5 border border-white/10">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>Live Darkroom Preview</span>
          </div>

          <img
            src={post.postImg}
            alt={caption}
            className="w-full h-full object-contain max-h-[460px] transition-all duration-150 select-none"
            style={filterStyle}
          />

          <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-white flex items-center justify-between text-xs">
            <span className="font-serif-editorial italic text-neutral-300 truncate mr-2">
              {caption || 'Untitled Monograph'}
            </span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-cyan-400 shrink-0">
              {PHOTO_FILTER_PRESETS.find((p) => p.id === selectedFilter)?.name || 'Custom'}
            </span>
          </div>
        </div>

        {/* Right Side: Darkroom Controls & Metadata */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-[600px] p-5">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div>
                <h3 className="text-lg font-serif-editorial font-bold">Edit Monograph</h3>
                <p className="text-[11px] font-sans text-neutral-500">
                  Refine visual filters, darkroom curves, and post metadata
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                }}
                className="p-1.5 rounded-full hover:bg-black/5 text-neutral-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-black/10 mt-3 text-xs font-sans font-bold uppercase tracking-wider">
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('filters');
                }}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'filters'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-neutral-400 hover:text-black'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('adjust');
                }}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'adjust'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-neutral-400 hover:text-black'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Curves</span>
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('metadata');
                }}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'metadata'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-neutral-400 hover:text-black'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
            </div>

            {/* Tab 1: Filter Presets */}
            {activeTab === 'filters' && (
              <div className="pt-4 space-y-4">
                <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-500 block">
                  Select Visual Grade:
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {PHOTO_FILTER_PRESETS.map((preset) => {
                    const isSelected = selectedFilter === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setSelectedFilter(preset.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/30'
                            : 'border-black/10 hover:border-black/30 hover:bg-neutral-50'
                        }`}
                      >
                        <div
                          className={`w-full h-5 rounded-md bg-gradient-to-r ${preset.previewColor} mb-1.5`}
                        />
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[11px] font-bold truncate">
                            {preset.name}
                          </span>
                          {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Sliders & Adjustments */}
            {activeTab === 'adjust' && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                    Fine-Tune Parameters:
                  </span>
                  <button
                    type="button"
                    onClick={handleResetSliders}
                    className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 hover:text-black flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-bold">Brightness / Exposure</span>
                    <span className="text-neutral-500 font-mono">{filterSettings.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filterSettings.brightness ?? 100}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, brightness: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-bold">Contrast</span>
                    <span className="text-neutral-500 font-mono">{filterSettings.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={filterSettings.contrast ?? 100}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, contrast: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-bold">Color Saturation</span>
                    <span className="text-neutral-500 font-mono">{filterSettings.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filterSettings.saturation ?? 100}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, saturation: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Sepia */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-bold">Warmth / Sepia Tone</span>
                    <span className="text-neutral-500 font-mono">{filterSettings.sepia}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterSettings.sepia ?? 0}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, sepia: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Blur / Soft Focus */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-bold">Soft Focus / Vignette</span>
                    <span className="text-neutral-500 font-mono">{filterSettings.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={filterSettings.blur ?? 0}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, blur: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Details & EXIF */}
            {activeTab === 'metadata' && (
              <div className="pt-4 space-y-4">
                {/* Caption */}
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-1">
                    Caption
                  </label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write an artistic narrative for this monograph..."
                    className="w-full p-2.5 text-xs font-sans border border-black/15 rounded-xl bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                    className="w-full p-2 text-xs font-sans border border-black/15 rounded-lg bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1 mb-1">
                    <Tag className="w-3 h-3 text-blue-500" />
                    <span>Tags (Press Enter to add)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="bg-neutral-100 text-neutral-800 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tag (e.g. architecture, 35mm) and press Enter"
                    className="w-full p-2 text-xs font-sans border border-black/15 rounded-lg bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                {/* Camera EXIF Details */}
                <div className="pt-2 border-t border-black/10">
                  <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex items-center gap-1 mb-2">
                    <Camera className="w-3 h-3 text-emerald-500" />
                    <span>Camera EXIF Data</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Camera</span>
                      <input
                        type="text"
                        value={exifCamera}
                        onChange={(e) => setExifCamera(e.target.value)}
                        placeholder="Leica Q3 / Sony A1"
                        className="w-full p-1.5 border border-black/15 rounded text-[11px] bg-neutral-50"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Lens</span>
                      <input
                        type="text"
                        value={exifLens}
                        onChange={(e) => setExifLens(e.target.value)}
                        placeholder="28mm f/1.7"
                        className="w-full p-1.5 border border-black/15 rounded text-[11px] bg-neutral-50"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Aperture</span>
                      <input
                        type="text"
                        value={exifAperture}
                        onChange={(e) => setExifAperture(e.target.value)}
                        placeholder="f/2.8"
                        className="w-full p-1.5 border border-black/15 rounded text-[11px] bg-neutral-50"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Shutter</span>
                      <input
                        type="text"
                        value={exifShutter}
                        onChange={(e) => setExifShutter(e.target.value)}
                        placeholder="1/1200s"
                        className="w-full p-1.5 border border-black/15 rounded text-[11px] bg-neutral-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-black/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
