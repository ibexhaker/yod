import React from 'react';
import { PlusSquare, Heart, Send, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenCreate: () => void;
  onOpenMessages: () => void;
  onOpenNotifications: () => void;
  unreadMessagesCount: number;
  unreadNotifsCount: number;
  onQuickAddDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreate,
  onOpenMessages,
  onOpenNotifications,
  unreadMessagesCount,
  unreadNotifsCount,
  onQuickAddDemo,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="flex items-center gap-2">
        <h1 className="font-brand text-3xl font-semibold text-neutral-900 tracking-tight select-none cursor-pointer hover:opacity-90 transition-opacity">
          Snap Grid
        </h1>
        <button
          id="btn-quick-snap"
          onClick={onQuickAddDemo}
          title="Instant Quick Post Demo"
          className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-200/60"
        >
          <Sparkles className="w-3 h-3 text-rose-500" />
          <span>Quick Snap</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          id="btn-header-create-post"
          onClick={onOpenCreate}
          className="p-1.5 text-neutral-800 hover:text-rose-600 hover:bg-neutral-100 rounded-full transition-colors"
          title="Create New Post"
          aria-label="Create New Post"
        >
          <PlusSquare className="w-6 h-6 stroke-[1.75]" />
        </button>

        <button
          id="btn-header-notifications"
          onClick={onOpenNotifications}
          className="relative p-1.5 text-neutral-800 hover:text-rose-600 hover:bg-neutral-100 rounded-full transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <Heart className="w-6 h-6 stroke-[1.75]" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        <button
          id="btn-header-messages"
          onClick={onOpenMessages}
          className="relative p-1.5 text-neutral-800 hover:text-rose-600 hover:bg-neutral-100 rounded-full transition-colors"
          title="Direct Messages"
          aria-label="Direct Messages"
        >
          <Send className="w-6 h-6 stroke-[1.75] -rotate-12 transform" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-white">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
