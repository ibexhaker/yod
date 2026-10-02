import React, { useState } from 'react';
import {
  Download,
  X,
  Check,
  Copy,
  Terminal,
  Cloud,
  Github,
  Globe,
  Archive,
  ArrowRight,
  FolderDown,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface DownloadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadProjectModal: React.FC<DownloadProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [activeDeployGuide, setActiveDeployGuide] = useState<'local' | 'vercel' | 'netlify' | 'github'>('local');

  if (!isOpen) return null;

  const handleDownload = () => {
    sound.playPop();
    setDownloading(true);

    // Direct download trigger
    const link = document.createElement('a');
    link.href = '/api/download-project';
    link.download = 'snap-grid-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string, id: string) => {
    sound.playLikeChime();
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl text-neutral-900 border border-neutral-200 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-md">
              <FolderDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-2xl font-light text-neutral-900 tracking-tight">
                Download <span className="italic opacity-80">Snap Grid</span> Code
              </h3>
              <p className="font-sans text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                Complete Project Archive &bull; Ready for Local, GitHub, Vercel & Netlify
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Main Download Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-neutral-700/50">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Archive className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-xs font-semibold text-blue-300">snap-grid-project.zip</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-neutral-300">~160 KB</span>
              </div>
              <h4 className="font-serif-editorial text-xl font-light text-white">
                Download Everything in 1-Click
              </h4>
              <p className="font-sans text-xs text-neutral-300 max-w-md">
                Includes all React 19 components, Tailwind CSS styling, PWA service worker, API routes, and deployment manifests.
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-6 py-3 bg-white text-neutral-900 rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 active:scale-95 transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4 text-neutral-900" />
              <span>{downloading ? 'Downloading...' : 'Download .ZIP'}</span>
            </button>
          </div>

          {/* Quick Deployment & Setup Guides */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider font-bold text-neutral-600">
                Setup & Deployment Guides
              </span>
              <span className="font-sans text-[11px] text-neutral-400">
                Choose your destination
              </span>
            </div>

            {/* Guide Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveDeployGuide('local')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
                  activeDeployGuide === 'local'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Run Locally</span>
              </button>

              <button
                onClick={() => setActiveDeployGuide('vercel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
                  activeDeployGuide === 'vercel'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Deploy to Vercel</span>
              </button>

              <button
                onClick={() => setActiveDeployGuide('netlify')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
                  activeDeployGuide === 'netlify'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Deploy to Netlify</span>
              </button>

              <button
                onClick={() => setActiveDeployGuide('github')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
                  activeDeployGuide === 'github'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>Push to GitHub</span>
              </button>
            </div>

            {/* Guide Contents */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-sans space-y-3">
              {activeDeployGuide === 'local' && (
                <div className="space-y-3">
                  <p className="text-neutral-700">
                    Extract the downloaded archive and start the development server on your machine:
                  </p>
                  <div className="relative bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                    <code>
                      unzip snap-grid-project.zip<br />
                      cd snap-grid-project<br />
                      npm install<br />
                      npm run dev
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'unzip snap-grid-project.zip\ncd snap-grid-project\nnpm install\nnpm run dev',
                          'local'
                        )
                      }
                      className="absolute top-2.5 right-2.5 p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 transition-colors"
                      title="Copy commands"
                    >
                      {copiedTab === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {activeDeployGuide === 'vercel' && (
                <div className="space-y-3">
                  <p className="text-neutral-700">
                    Deploy instantly using the Vercel CLI (or push the code to a GitHub repo and connect it in your Vercel Dashboard):
                  </p>
                  <div className="relative bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                    <code>
                      # Install Vercel CLI & deploy<br />
                      npm i -g vercel<br />
                      vercel
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard('npm i -g vercel\nvercel', 'vercel')
                      }
                      className="absolute top-2.5 right-2.5 p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 transition-colors"
                      title="Copy commands"
                    >
                      {copiedTab === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Tip: <code>vercel.json</code> is already configured and included in the zip!
                  </p>
                </div>
              )}

              {activeDeployGuide === 'netlify' && (
                <div className="space-y-3">
                  <p className="text-neutral-700">
                    Deploy directly with the Netlify CLI or drag-and-drop the <code>dist/</code> folder into Netlify Drop:
                  </p>
                  <div className="relative bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                    <code>
                      # Build and deploy with Netlify CLI<br />
                      npm install<br />
                      npm run build<br />
                      npx netlify-cli deploy --prod --dir=dist
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'npm install\nnpm run build\nnpx netlify-cli deploy --prod --dir=dist',
                          'netlify'
                        )
                      }
                      className="absolute top-2.5 right-2.5 p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 transition-colors"
                      title="Copy commands"
                    >
                      {copiedTab === 'netlify' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Tip: <code>netlify.toml</code> and <code>public/_redirects</code> are already configured!
                  </p>
                </div>
              )}

              {activeDeployGuide === 'github' && (
                <div className="space-y-3">
                  <p className="text-neutral-700">
                    Initialize a git repository in the extracted folder and push to your GitHub account:
                  </p>
                  <div className="relative bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                    <code>
                      git init<br />
                      git add .<br />
                      git commit -m "Initial commit of Snap Grid PWA"<br />
                      git branch -M main<br />
                      git remote add origin https://github.com/YOUR_USERNAME/snap-grid.git<br />
                      git push -u origin main
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'git init\ngit add .\ngit commit -m "Initial commit of Snap Grid PWA"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/snap-grid.git\ngit push -u origin main',
                          'github'
                        )
                      }
                      className="absolute top-2.5 right-2.5 p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 transition-colors"
                      title="Copy commands"
                    >
                      {copiedTab === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between shrink-0">
          <a
            href="/snap-grid-project.zip"
            download="snap-grid-project.zip"
            className="text-[11px] font-sans text-neutral-500 hover:text-neutral-800 underline flex items-center gap-1"
          >
            <span>Direct static download fallback</span>
            <ArrowRight className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 font-sans text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
