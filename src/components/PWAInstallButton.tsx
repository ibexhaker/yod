import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'pill' | 'compact' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else {
      // In browsers without beforeinstallprompt (or when not yet triggered), show manual instructions
      setShowIOSGuide(true);
    }
  };

  // 1. Card variant (great for Profile or Settings)
  if (variant === 'card') {
    return (
      <>
        <div className={`p-4 rounded-2xl bg-neutral-900 text-white shadow-lg flex items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-neutral-100" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-sm text-white">Install Snap Grid App</h4>
              <p className="font-sans text-xs text-neutral-300">
                Launch instantly from home screen with full offline caching.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="px-4 py-2 bg-white text-neutral-900 rounded-full font-sans text-xs font-bold hover:bg-neutral-100 transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        </div>

        {showIOSGuide && (
          <IOSGuideModal onClose={() => setShowIOSGuide(false)} />
        )}
      </>
    );
  }

  // 2. Compact variant (icon button for mobile top app bar)
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`p-1.5 rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors relative flex items-center justify-center ${className}`}
          title="Install Snap Grid Web App"
          aria-label="Install Snap Grid Web App"
        >
          <Download className="w-4 h-4" />
        </button>

        {showIOSGuide && (
          <IOSGuideModal onClose={() => setShowIOSGuide(false)} />
        )}
      </>
    );
  }

  // 3. Default Pill variant (desktop header / main rail)
  return (
    <>
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`px-3 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 border border-black/15 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white ${className}`}
        title="Install Snap Grid as a Progressive Web App"
      >
        <Download className="w-3.5 h-3.5 stroke-[2]" />
        <span>Install App</span>
      </button>

      {showIOSGuide && (
        <IOSGuideModal onClose={() => setShowIOSGuide(false)} />
      )}
    </>
  );
};

// Guide Modal for Safari iOS or browsers requiring manual add to home screen
const IOSGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-neutral-900 border border-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-neutral-800" />
            <h3 className="font-serif-editorial text-xl font-medium text-neutral-900">
              Install Snap Grid
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-xs text-neutral-600 leading-relaxed font-sans">
          To install Snap Grid as a standalone web application on your device:
        </p>

        <div className="mt-4 space-y-3 font-sans text-xs">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="leading-snug">
              Tap the <strong className="text-neutral-900 font-semibold">Share</strong> button in your browser toolbar{' '}
              <Share className="inline w-3.5 h-3.5 text-blue-600 mx-0.5" />
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="leading-snug">
              Scroll down and tap <strong className="text-neutral-900 font-semibold">Add to Home Screen</strong>{' '}
              <PlusSquare className="inline w-3.5 h-3.5 text-neutral-800 mx-0.5" />
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="leading-snug">
              Tap <strong className="text-neutral-900 font-semibold">Add</strong> in the top-right corner to finish.
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center gap-2 text-emerald-800 text-[11px] font-medium font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No app store download required. Runs offline seamlessly.</span>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-sans font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
