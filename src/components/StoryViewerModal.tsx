import React, { useEffect, useState } from 'react';
import { Story } from '../types';
import { X, ChevronLeft, ChevronRight, Heart, Send, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface StoryViewerModalProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onSendStoryReply?: (username: string, replyText: string) => void;
}

const QUICK_STORY_EMOJIS = ['🔥', '❤️', '👏', '😍', '💯'];

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryIndex,
  onClose,
  onSendStoryReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [sentFeedback, setSentFeedback] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReply = (textToSend?: string) => {
    const text = textToSend || replyInput.trim();
    if (!text) return;

    sound.playPop();
    onSendStoryReply?.(currentStory.username, text);
    setReplyInput('');
    setSentFeedback(true);
    setTimeout(() => setSentFeedback(false), 2000);
  };

  const handleQuickEmoji = (emoji: string) => {
    sound.playLikeChime();
    handleSendReply(`Reacted to your story: ${emoji}`);
  };

  return (
    <div
      id="story-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Story container */}
      <div
        className="relative w-full max-w-sm md:max-w-md h-[82vh] max-h-[740px] bg-black rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Media */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${currentStory.mediaUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Top Progress Bars & Header */}
        <div className="relative z-20 p-4">
          <div className="flex gap-1.5 mb-3">
            {stories.map((s, idx) => (
              <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx === currentIndex
                        ? `${progress}%`
                        : idx < currentIndex
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userImg}
                alt={currentStory.username}
                className="w-8 h-8 rounded-full object-cover border border-white/40"
              />
              <div>
                <span className="font-sans text-xs font-bold tracking-wide block">
                  {currentStory.username}
                </span>
                <span className="font-sans text-[10px] text-white/70">
                  {currentStory.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                aria-label="Close story"
                className="p-1.5 rounded-full text-white/80 hover:text-white bg-black/40 backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Touch zones for navigation */}
        <div className="relative z-10 flex-1 flex items-center justify-between px-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full bg-black/40 text-white/80 hover:text-white transition-opacity ${
              currentIndex === 0 ? 'opacity-0' : 'opacity-80'
            }`}
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-black/40 text-white/80 hover:text-white transition-opacity opacity-80"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom interaction bar & quick reactions */}
        <div className="relative z-20 p-4 space-y-2.5">
          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-center gap-2.5 py-1">
            {QUICK_STORY_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleQuickEmoji(emoji)}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-lg flex items-center justify-center hover:scale-125 hover:bg-black/60 transition-transform active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Reply to @${currentStory.username}...`}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendReply();
                  }
                }}
                className="w-full bg-white/20 backdrop-blur-md text-white placeholder-white/60 font-sans text-xs pl-4 pr-10 py-2.5 rounded-full border border-white/25 focus:outline-none focus:border-white/70"
              />
              {replyInput.trim() && (
                <button
                  type="button"
                  onClick={() => handleSendReply()}
                  className="absolute right-2 top-2 p-1 rounded-full bg-white text-black hover:scale-105 transition-transform"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                sound.playLikeChime();
                setIsLiked(!isLiked);
              }}
              className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
              aria-label="Like story"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? 'fill-[#ed4956] text-[#ed4956]' : 'text-white'
                }`}
              />
            </button>
          </div>

          {sentFeedback && (
            <p className="text-center font-sans text-[11px] text-white/90 bg-black/50 py-1 rounded-md backdrop-blur-sm flex items-center justify-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Letter sent to @{currentStory.username}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
