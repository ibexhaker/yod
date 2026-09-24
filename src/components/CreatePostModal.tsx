import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, MapPin, Sparkles, Check, UploadCloud } from 'lucide-react';
import { PRESET_IMAGE_GALLERY } from '../data/initialData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (data: {
    imageUrl: string;
    caption: string;
    location: string;
    filter?: string;
  }) => void;
}

const FILTERS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'vivid', name: 'Vivid', css: 'contrast-125 saturate-125' },
  { id: 'warm', name: 'Warm', css: 'sepia-[.25] saturate-110 hue-rotate-[-10deg]' },
  { id: 'bw', name: 'Mono', css: 'grayscale contrast-125' },
  { id: 'vintage', name: 'Vintage', css: 'contrast-110 brightness-95 sepia-[.4]' },
  { id: 'cool', name: 'Cyber', css: 'hue-rotate-[20deg] saturate-130' }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGE_GALLERY[0].url);
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>(PRESET_IMAGE_GALLERY[0].location);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [tab, setTab] = useState<'gallery' | 'upload'>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setTab('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    onPostCreated({
      imageUrl: selectedImage,
      caption: caption.trim() || 'Sharing a special moment on Snap Grid! ✨📸',
      location: location.trim(),
      filter: selectedFilter !== 'normal' ? selectedFilter : undefined,
    });

    // Reset and close
    setCaption('');
    onClose();
  };

  const currentFilterClass = FILTERS.find((f) => f.id === selectedFilter)?.css || '';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-neutral-900">Create New Post</h2>
          <button
            onClick={handleSubmit}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors"
          >
            Share
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {/* Tabs: Choose Preset vs Upload Photo */}
          <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-medium text-neutral-600">
            <button
              type="button"
              onClick={() => setTab('gallery')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'gallery' ? 'bg-white text-neutral-900 shadow-sm font-semibold' : 'hover:text-neutral-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Curated Snaps
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('upload');
                fileInputRef.current?.click();
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'upload' ? 'bg-white text-neutral-900 shadow-sm font-semibold' : 'hover:text-neutral-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" /> Upload File
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Preset selector grid if in gallery tab */}
          {tab === 'gallery' && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-neutral-400">Select Preset Photo</span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_IMAGE_GALLERY.map((item) => (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => {
                      setSelectedImage(item.url);
                      setLocation(item.location);
                    }}
                    className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all group ${
                      selectedImage === item.url ? 'border-rose-500 scale-[0.98]' : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    {selectedImage === item.url && (
                      <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                        <div className="bg-rose-500 text-white p-1 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Preview Container with filter preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase text-neutral-400">Preview & Filters</span>
            <div className="relative w-full aspect-square max-h-64 bg-neutral-950 rounded-xl overflow-hidden border border-neutral-200">
              <img
                src={selectedImage}
                alt="Upload preview"
                className={`w-full h-full object-cover transition-all duration-200 ${currentFilterClass}`}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all flex-shrink-0 ${
                    selectedFilter === f.id
                      ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase text-neutral-400">Caption</label>
            <textarea
              rows={3}
              placeholder="Write a captivating caption with hashtags... #photography #vibes"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full text-xs text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 focus:border-rose-400 rounded-xl p-3 outline-none resize-none"
            />
          </div>

          {/* Location Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase text-neutral-400">Add Location</label>
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 focus-within:border-rose-400 rounded-xl px-3 py-2">
              <MapPin className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="e.g. San Francisco, California"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs text-neutral-900 bg-transparent outline-none placeholder-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Auto-optimized for feed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 px-4 py-1.5 rounded-xl shadow-sm hover:shadow transition-all"
            >
              Post Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
