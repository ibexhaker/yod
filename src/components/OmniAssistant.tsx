import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { AppTheme } from '../types';
import { THEME_STYLES } from '../utils/theme';
import {
  Sparkles,
  X,
  Send,
  Compass,
  Sliders,
  Palette,
  Clapperboard,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Bot,
  Lightbulb,
} from 'lucide-react';

interface OmniAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onSelectTab: (tab: string) => void;
  onSelectTheme: (theme: AppTheme) => void;
  onOpenCreatePost: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'omni';
  text: string;
  timestamp: string;
}

const TOUR_STEPS = [
  {
    title: '1. The Editorial Feed & Monographs',
    icon: Compass,
    content:
      'Explore fine art monographs curated from photographers worldwide. Double-tap any photograph to appreciate with a like chime, inspect technical camera EXIF details (aperture, lens, shutter), and leave editorial comments.',
    actionLabel: 'Go to Feed',
    tab: 'feed',
  },
  {
    title: '2. Post Editor & Darkroom Curves',
    icon: Sliders,
    content:
      'Edit your captures anytime! Tap "Edit Post" on any monograph to apply custom visual filters (Cyber Blue, 35mm B&W, Sepia Noir, Golden Hour) or fine-tune darkroom sliders (Brightness, Contrast, Saturation, Vignette).',
    actionLabel: 'Try Post Editor',
    tab: 'feed',
  },
  {
    title: '3. Full-Motion Shorts',
    icon: Clapperboard,
    content:
      'Immerse yourself in vertical motion monographs with synchronized ambient soundscapes and soundtracks. Experience photography in motion.',
    actionLabel: 'Watch Shorts',
    tab: 'reels',
  },
  {
    title: '4. Friend Letters & Chat',
    icon: MessageCircle,
    content:
      'Send private letters and direct messages to your fellow curators. You can attach full Shorts directly into your conversations with a single tap!',
    actionLabel: 'Open Letters Chat',
    tab: 'messages',
  },
  {
    title: '5. Tri-Palette Visual Themes',
    icon: Palette,
    content:
      'Tailor Snap Grid to your aesthetic: White & Blue (gallery white with cobalt blue), Blue & Black (obsidian darkroom with electric cyan), or White & Black (monochrome editorial).',
    actionLabel: 'Switch Palette',
    tab: 'profile',
  },
];

export const OmniAssistant: React.FC<OmniAssistantProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectTab,
  onSelectTheme,
  onOpenCreatePost,
}) => {
  const currentTheme = THEME_STYLES[theme];

  const [activeMode, setActiveMode] = useState<'chat' | 'tour'>('chat');
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'omni',
      text: "Greetings! I'm Omni, your intelligent visual guide on Snap Grid. Ask me anything about photo composition, camera EXIF, post filters, or tap below to take a complete interactive tour!",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeMode]);

  if (!isOpen) return null;

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isTyping) return;

    const trimmed = userText.trim();
    setInputMessage('');
    sound.playPop();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Server-side call to Express Omni Gemini route
      const response = await fetch('/api/omni/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-5).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned error');
      }

      const data = await response.json();
      sound.playLikeChime();

      const omniMsg: ChatMessage = {
        id: `o-${Date.now()}`,
        sender: 'omni',
        text: data.reply || "I'm here to assist your visual journey on Snap Grid.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, omniMsg]);
    } catch (err) {
      console.warn('Omni fetch error, using smart response:', err);
      sound.playLikeChime();
      const fallbackReply =
        "I'm Omni, your intelligent visual curator. You can edit any post's filters and darkroom curves, explore full-motion Shorts, message friends with attached video snaps, and toggle between our White & Blue, Blue & Black, and White & Black palettes anytime!";

      setMessages((prev) => [
        ...prev,
        {
          id: `o-${Date.now()}`,
          sender: 'omni',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExecuteTourAction = (stepIndex: number) => {
    sound.playCameraShutter();
    const step = TOUR_STEPS[stepIndex];
    if (step.tab) {
      onSelectTab(step.tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <div
        className={`w-full max-w-2xl h-[90vh] max-h-[640px] ${currentTheme.modalBg} border shadow-2xl rounded-2xl flex flex-col overflow-hidden relative`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-black/10 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
              <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black tracking-widest text-sm uppercase">
                  OMNI AI
                </span>
                <span className="bg-white/20 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Intellect v3.8
                </span>
              </div>
              <span className="text-[10px] text-white/80 font-sans block">
                Visual Curator & Smart Platform Guide
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-black/20 p-1 rounded-lg flex items-center gap-1 text-[11px] font-sans font-bold">
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveMode('chat');
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeMode === 'chat' ? 'bg-white text-black shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveMode('tour');
                }}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  activeMode === 'tour' ? 'bg-white text-black shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>Tour</span>
              </button>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeMode === 'chat' ? (
          /* Chat Mode */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Quick Action Chips */}
            <div className="p-3 border-b border-black/10 bg-black/5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar shrink-0">
              <button
                onClick={() => handleSendMessage('Show me around Snap Grid')}
                className="bg-white dark:bg-black/40 border border-black/10 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold shrink-0 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Compass className="w-3 h-3 text-blue-500" />
                <span>Show me around</span>
              </button>
              <button
                onClick={() => handleSendMessage('How do I edit my post filters and curves?')}
                className="bg-white dark:bg-black/40 border border-black/10 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold shrink-0 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Sliders className="w-3 h-3 text-cyan-500" />
                <span>How to edit post filters</span>
              </button>
              <button
                onClick={() => handleSendMessage('Explain the White & Blue, Blue & Black, and White & Black themes')}
                className="bg-white dark:bg-black/40 border border-black/10 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold shrink-0 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Palette className="w-3 h-3 text-purple-500" />
                <span>Explain color themes</span>
              </button>
              <button
                onClick={() => handleSendMessage('Give me photography composition tips for architectural shots')}
                className="bg-white dark:bg-black/40 border border-black/10 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold shrink-0 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>Composition tips</span>
              </button>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    {m.sender === 'omni' ? (
                      <div className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider text-blue-600">
                        <Sparkles className="w-3 h-3" />
                        <span>Omni</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">
                        You
                      </span>
                    )}
                    <span className="text-[9px] text-neutral-400 font-sans">• {m.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-sans leading-relaxed whitespace-pre-line shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-black/40 border border-black/10 text-neutral-900 dark:text-neutral-100 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-blue-600 font-sans text-xs italic p-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <span>Omni is analyzing and composing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="p-3 border-t border-black/10 bg-white dark:bg-black/30 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Omni anything (composition, filters, how to tour)..."
                className="flex-1 p-2.5 text-xs font-sans border border-black/15 rounded-xl bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Guided Tour Mode */
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-serif-editorial font-bold">
                    Interactive Tour of Snap Grid
                  </h4>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    Step {currentTourStep + 1} of {TOUR_STEPS.length}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {TOUR_STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTourStep(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentTourStep ? 'w-6 bg-blue-600' : 'w-2 bg-neutral-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step Card */}
              {(() => {
                const step = TOUR_STEPS[currentTourStep];
                const StepIcon = step.icon;
                return (
                  <div className="p-6 rounded-2xl border border-black/10 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 dark:from-neutral-900 dark:to-neutral-950 space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <StepIcon className="w-6 h-6" />
                    </div>

                    <h5 className="text-lg font-serif-editorial font-bold">{step.title}</h5>

                    <p className="text-xs font-sans text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {step.content}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          handleExecuteTourAction(currentTourStep);
                          onClose();
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-md"
                      >
                        <span>{step.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {currentTourStep === 4 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectTheme('white-blue')}
                            className="text-[10px] font-sans font-bold px-2 py-1 rounded bg-white border border-blue-300 text-blue-700"
                          >
                            White & Blue
                          </button>
                          <button
                            onClick={() => onSelectTheme('blue-black')}
                            className="text-[10px] font-sans font-bold px-2 py-1 rounded bg-black text-cyan-400 border border-cyan-800"
                          >
                            Blue & Black
                          </button>
                          <button
                            onClick={() => onSelectTheme('white-black')}
                            className="text-[10px] font-sans font-bold px-2 py-1 rounded bg-neutral-900 text-white"
                          >
                            White & Black
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tour Navigation Controls */}
            <div className="pt-6 border-t border-black/10 flex items-center justify-between">
              <button
                disabled={currentTourStep === 0}
                onClick={() => {
                  sound.playPop();
                  setCurrentTourStep((prev) => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 hover:text-black disabled:opacity-30"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  if (currentTourStep < TOUR_STEPS.length - 1) {
                    setCurrentTourStep((prev) => prev + 1);
                  } else {
                    setActiveMode('chat');
                  }
                }}
                className="px-5 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-sans font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow"
              >
                <span>{currentTourStep < TOUR_STEPS.length - 1 ? 'Next Step' : 'Finish Tour'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
