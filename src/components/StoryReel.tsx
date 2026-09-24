import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Story } from '../types';

interface StoryReelProps {
  stories: Story[];
  onAddStory: () => void;
}

export const StoryReel: React.FC<StoryReelProps> = ({ stories, onAddStory }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto progression timer for story viewer
  useEffect(() => {
    if (activeStoryIndex === null) {
      setStoryProgress(0);
      return;
    }

    if (isPaused) return;

    const intervalTime = 50; // update progress every 50ms
    const totalDuration = 5000; // 5 seconds per story
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story if available
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused, stories.length]);

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
  };

  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setStoryProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    }
  };

  return (
    <>
      {/* Horizontal Story Reel */}
      <div className="flex items-center gap-3.5 px-4 py-3.5 overflow-x-auto bg-white border-b border-neutral-100 no-scrollbar select-none">
        {/* Add your own story */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group" onClick={onAddStory}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-0.5 border border-dashed border-neutral-300 group-hover:border-rose-400 transition-colors">
              <img
                src={stories[0]?.userImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                alt="Your story"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 group-hover:bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white transition-transform group-hover:scale-110">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-neutral-700 max-w-[64px] truncate text-center">
            Your story
          </span>
        </div>

        {/* Other stories */}
        {stories.slice(1).map((story, index) => {
          const actualIndex = index + 1;
          return (
            <button
              key={story.id}
              id={`story-item-${story.id}`}
              onClick={() => handleOpenStory(actualIndex)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group focus:outline-none"
            >
              <div
                className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                  story.hasUnseen
                    ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
                    : 'bg-neutral-200'
                }`}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-white">
                  <img
                    src={story.userImg}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-neutral-700 max-w-[68px] truncate text-center">
                {story.username}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && stories[activeStoryIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="relative w-full max-w-[420px] h-[90vh] max-h-[780px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between mx-3">
            {/* Top Progress Bars */}
            <div className="absolute top-0 inset-x-0 z-20 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex gap-1.5 mb-3">
                {stories.map((s, idx) => {
                  let width = '0%';
                  if (idx < activeStoryIndex) width = '100%';
                  else if (idx === activeStoryIndex) width = `${storyProgress}%`;

                  return (
                    <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-75 ease-linear"
                        style={{ width }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Story Header */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={stories[activeStoryIndex].userImg}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/80"
                  />
                  <div>
                    <div className="text-xs font-bold leading-none">{stories[activeStoryIndex].username}</div>
                    <div className="text-[10px] text-white/70">{stories[activeStoryIndex].timestamp}</div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStoryIndex(null)}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story Image */}
            <div className="relative flex-1 w-full bg-neutral-950 flex items-center justify-center">
              <img
                src={stories[activeStoryIndex].mediaUrl}
                alt="Story"
                className="w-full h-full object-cover select-none"
              />

              {/* Left/Right Tap Area */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10 flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevStory();
                }}
              >
                {activeStoryIndex > 0 && (
                  <div className="p-2 bg-black/40 text-white rounded-full backdrop-blur-sm">
                    <ChevronLeft className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div
                className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10 flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextStory();
                }}
              >
                <div className="p-2 bg-black/40 text-white rounded-full backdrop-blur-sm">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Bottom Story Footer */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <Eye className="w-4 h-4" />
                <span>342 viewers</span>
              </div>
              <div className="text-xs font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                {activeStoryIndex + 1} of {stories.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
