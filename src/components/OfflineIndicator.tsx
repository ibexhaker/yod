import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 md:bottom-6 left-4 md:left-6 z-50 flex items-center gap-3 rounded-full bg-neutral-900/95 text-white px-4 py-2.5 text-xs font-sans font-medium shadow-2xl backdrop-blur-md border border-neutral-700/60 animate-bounce duration-1000"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
      </span>
      <div className="flex items-center gap-1.5">
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span>Offline Mode &bull; Cached gallery active</span>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="ml-1 p-1 hover:bg-neutral-800 rounded-full transition-colors"
        title="Retry connection"
      >
        <RefreshCw className="w-3 h-3 text-neutral-300" />
      </button>
    </div>
  );
};
