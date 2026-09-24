import React, { useState } from 'react';
import { Search, Sparkles, Heart, Eye } from 'lucide-react';
import { EXPLORE_GRID_ITEMS } from '../data';

interface ExploreViewProps {
  onSelectPhoto: (item: any) => void;
}

const CATEGORIES = ['All', 'Architecture', 'Travel', 'Urban', 'Minimalism', 'Culinary', 'Art'];

export const ExploreView: React.FC<ExploreViewProps> = ({ onSelectPhoto }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = EXPLORE_GRID_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header */}
      <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 p-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-serif-editorial font-light text-[#1A1A1A]">
            Curated <span className="italic opacity-70">Discovery</span>
          </h2>
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A]/50 mt-1 mb-4">
            Discover avant-garde visual narratives from the global collective
          </p>

          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search by aesthetic, author (@aurora_lens), or medium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/15 pl-10 pr-4 py-2.5 text-xs font-sans text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#1A1A1A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 font-sans text-[10px] uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-[10px] font-sans uppercase tracking-widest transition-all rounded-full shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white font-bold shadow-sm'
                  : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:border-[#1A1A1A]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectPhoto(item)}
            className={`group relative bg-[#EAEAEA] overflow-hidden cursor-pointer border border-[#1A1A1A]/5 shadow-sm transition-all duration-300 hover:shadow-md ${
              idx % 5 === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
            }`}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
              <div className="flex justify-end">
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-sans uppercase tracking-widest rounded-full">
                  {item.category}
                </span>
              </div>
              <div>
                <h4 className="font-serif-editorial text-lg leading-tight font-normal">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[11px] font-sans text-white/80">
                  <span>@{item.author}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-white" />
                    {item.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
