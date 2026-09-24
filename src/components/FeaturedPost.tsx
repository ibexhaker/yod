import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, Sparkles } from 'lucide-react';

interface FeaturedPostProps {
  post: Post;
  onToggleLike: (postId: string | number) => void;
  onSelectUser?: (username: string) => void;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({
  post,
  onToggleLike,
  onSelectUser,
}) => {
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!post.isLiked) {
        onToggleLike(post.id);
      }
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
    setLastTap(now);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF9F6] border border-[#1A1A1A]/10 p-5 md:p-6 mb-8 group transition-all hover:border-[#1A1A1A]/20">
      {/* Featured visual banner */}
      <div
        className="relative min-h-[280px] md:min-h-[360px] flex-1 bg-[#E8E6E1] overflow-hidden cursor-pointer select-none"
        onClick={handleDoubleTap}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${post.postImg}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Featured badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1 font-sans text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A] shadow-sm border border-black/5 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#1A1A1A]" />
          <span>Curator Spotlight</span>
        </div>

        {/* Double-tap animated heart */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-heart-burst drop-shadow-xl bg-white/95 backdrop-blur-sm p-5 rounded-full">
              <Heart className="w-14 h-14 fill-[#ed4956] text-[#ed4956]" />
            </div>
          </div>
        )}

        {/* Location pill */}
        {post.location && (
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 font-sans text-[10px] uppercase tracking-wider rounded-full">
            {post.location}
          </div>
        )}
      </div>

      {/* Headline & Metadata */}
      <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif-editorial font-light leading-tight text-[#1A1A1A]">
            The Architecture of <br className="hidden md:inline" />
            <span className="italic opacity-80">Silent Spaces</span>
          </h2>
          <div className="flex items-center gap-3 mt-2.5">
            <button
              onClick={() => onSelectUser?.(post.username)}
              className="font-sans text-[11px] uppercase tracking-wider font-semibold opacity-70 hover:opacity-100 transition-opacity"
            >
              @{post.username}
            </button>
            <span className="font-sans text-[11px] opacity-30">•</span>
            <span className="font-sans text-[11px] uppercase tracking-wider opacity-60">
              {post.timestamp}
            </span>
          </div>
        </div>

        <div className="flex items-center md:flex-col md:items-end gap-3 md:gap-1 self-stretch md:self-auto justify-between border-t md:border-t-0 border-[#1A1A1A]/10 pt-3 md:pt-0">
          <button
            onClick={() => onToggleLike(post.id)}
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="Appreciate spotlight"
          >
            <div className="text-2xl md:text-3xl font-serif-editorial font-light tabular-nums text-[#1A1A1A]">
              {post.likes.toLocaleString()}
            </div>
            <Heart
              className={`w-5 h-5 transition-colors ${
                post.isLiked
                  ? 'fill-[#ed4956] text-[#ed4956]'
                  : 'text-[#1A1A1A] group-hover:text-neutral-600'
              }`}
            />
          </button>
          <div className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold opacity-40">
            {post.isLiked ? 'Appreciated' : 'Interactions'}
          </div>
        </div>
      </div>
    </div>
  );
};
