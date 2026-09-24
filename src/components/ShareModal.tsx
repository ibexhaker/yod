import React, { useState } from 'react';
import { X, Copy, Check, Send, Sparkles } from 'lucide-react';
import { Post } from '../types';

interface ShareModalProps {
  post: Post | null;
  onClose: () => void;
  onSendToUser: (username: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, onClose, onSendToUser }) => {
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (!post) return null;

  const curators = [
    { username: 'aurora_lens', name: 'Astrid Lind', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' },
    { username: 'summit_views', name: 'Kai Thorne', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
    { username: 'foodie_heaven', name: 'Lucas Rossi', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { username: 'atelier_nord', name: 'Freja Olsen', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (uname: string) => {
    onSendToUser(uname);
    setSentTo(uname);
    setTimeout(() => setSentTo(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFCFB] border border-[#1A1A1A]/10 w-full max-w-md p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
          <div>
            <h3 className="text-xl font-serif-editorial font-light text-[#1A1A1A]">
              Share <span className="italic opacity-70">Publication</span>
            </h3>
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/50 mt-0.5">
              Send directly to curators
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="p-1 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Curators List */}
        <div className="space-y-3">
          <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 block">
            Direct Curators
          </span>
          <div className="space-y-2">
            {curators.map((c) => (
              <div
                key={c.username}
                className="flex items-center justify-between p-2 hover:bg-[#FAF9F6] border border-transparent hover:border-[#1A1A1A]/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={c.img} alt={c.username} className="w-9 h-9 rounded-full object-cover border border-[#1A1A1A]/10" />
                  <div>
                    <h4 className="font-sans text-xs font-bold text-[#1A1A1A]">{c.name}</h4>
                    <span className="font-sans text-[10px] text-[#1A1A1A]/50">@{c.username}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSend(c.username)}
                  className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold transition-all ${
                    sentTo === c.username
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#1A1A1A] text-white hover:bg-black'
                  }`}
                >
                  {sentTo === c.username ? 'Sent' : 'Send'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Link */}
        <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between">
          <span className="font-sans text-xs text-[#1A1A1A]/70">Direct publication link</span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-white border border-[#1A1A1A]/20 px-3 py-1.5 text-xs font-sans uppercase tracking-wider font-semibold text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
