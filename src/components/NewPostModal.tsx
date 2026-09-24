import React, { useState } from 'react';
import { X, Image as ImageIcon, MapPin, Sparkles, Wand2 } from 'lucide-react';
import { Post } from '../types';

interface NewPostModalProps {
  onClose: () => void;
  onPublish: (post: Partial<Post>) => void;
}

const PRESET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    title: 'Minimal Geometric Arc',
  },
  {
    url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200&auto=format&fit=crop',
    title: 'Brutalist Interior',
  },
  {
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
    title: 'Monochrome Still Life',
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    title: 'High Alpine Horizon',
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    title: 'Glass Façade Shadows',
  },
];

const FILTERS = [
  { id: 'none', label: 'Original', class: '' },
  { id: 'grayscale', label: 'Noir B&W', class: 'grayscale contrast-110' },
  { id: 'sepia', label: 'Vintage Warm', class: 'sepia-[0.4] contrast-105 brightness-95' },
  { id: 'vivid', label: 'Editorial Vivid', class: 'saturate-150 contrast-110' },
  { id: 'warm', label: 'Muted Grain', class: 'sepia-[0.2] saturate-125' },
];

export const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onPublish }) => {
  const [selectedImg, setSelectedImg] = useState(PRESET_IMAGES[0].url);
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Stockholm, Sweden');
  const [activeFilter, setActiveFilter] = useState('none');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImg = isCustomMode && customImgUrl.trim() ? customImgUrl.trim() : selectedImg;

    onPublish({
      postImg: finalImg,
      caption: caption || 'New visual study. Light, space, and architectural resonance. 🏛️✨ #snapgrid #editorial',
      location: location.trim() || undefined,
      filter: activeFilter,
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImg(event.target.result as string);
          setIsCustomMode(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentFilterClass = FILTERS.find((f) => f.id === activeFilter)?.class || '';

  return (
    <div
      id="new-post-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFCFB] border border-[#1A1A1A]/10 w-full max-w-3xl rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image Preview & Filter Selection */}
        <div className="w-full md:w-1/2 bg-[#FAF9F6] border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A]/60">
                Visual Canvas
              </span>
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1A1A1A]/40">
                1:1 Curation Ratio
              </span>
            </div>

            {/* Preview Frame */}
            <div className="relative aspect-square w-full bg-[#E8E6E1] overflow-hidden border border-[#1A1A1A]/10 mb-4 group">
              <img
                src={isCustomMode && customImgUrl ? customImgUrl : selectedImg}
                alt="Post Preview"
                className={`w-full h-full object-cover transition-all duration-300 ${currentFilterClass}`}
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 text-[9px] font-sans uppercase tracking-widest">
                Preview
              </div>
            </div>

            {/* Filter Pills */}
            <div className="space-y-1.5">
              <span className="font-sans text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 block">
                Editorial Filters
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1 text-[10px] font-sans uppercase tracking-wider rounded-full transition-all ${
                      activeFilter === filter.id
                        ? 'bg-[#1A1A1A] text-white font-bold'
                        : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:border-[#1A1A1A]/40'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10">
            <span className="font-sans text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 block mb-2">
              Curated Stock Selection
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImg(preset.url);
                    setIsCustomMode(false);
                  }}
                  className={`w-12 h-12 shrink-0 border overflow-hidden transition-all ${
                    selectedImg === preset.url && !isCustomMode
                      ? 'border-[#1A1A1A] ring-2 ring-[#1A1A1A]/20'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Caption, Location, & Actions */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10 mb-5">
              <h3 className="text-xl font-serif-editorial font-light text-[#1A1A1A]">
                Studio <span className="italic opacity-70">Publication</span>
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Image / Upload Toggle */}
            <div className="mb-4 space-y-2">
              <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 flex items-center justify-between">
                <span>Media Source</span>
                <span className="text-[9px] font-normal opacity-50">Upload or URL</span>
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-white border border-[#1A1A1A]/15 px-3 py-2 text-[11px] font-sans flex items-center gap-1.5 hover:bg-neutral-50 transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>Choose File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={customImgUrl}
                  onChange={(e) => {
                    setCustomImgUrl(e.target.value);
                    setIsCustomMode(true);
                  }}
                  className="flex-1 bg-white border border-[#1A1A1A]/15 px-3 py-2 text-xs font-sans placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-4 space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Location Tag</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Kyoto, Japan"
                className="w-full bg-white border border-[#1A1A1A]/15 px-3 py-2 text-xs font-sans placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            {/* Caption */}
            <div className="mb-4 space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 flex items-center justify-between">
                <span>Caption & Narrative</span>
                <span className="text-[9px] font-normal opacity-50">{caption.length}/300</span>
              </label>
              <textarea
                rows={4}
                maxLength={300}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write an editorial description, tags (#architecture, #design), or context..."
                className="w-full bg-white border border-[#1A1A1A]/15 p-3 text-xs font-sans placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#1A1A1A] resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-sans uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#1A1A1A] text-white px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-sm"
            >
              Publish to Grid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
