import React from 'react';
import { AppNotification } from '../types';
import { Sparkles, TrendingUp, HardDrive, ShieldCheck } from 'lucide-react';
import { SnapGridLogo } from './SnapGridLogo';

interface RightSidebarProps {
  notifications: AppNotification[];
  onSelectTag: (tag: string) => void;
  onOpenStudio: () => void;
  totalInteractions: number;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  notifications,
  onSelectTag,
  onOpenStudio,
  totalInteractions,
}) => {
  const trends = ['#minimalism', '#bauhaus_vibes', '#golden_hour', '#monochrome', '#silent_spaces'];

  return (
    <aside className="w-80 border-l border-[#1A1A1A]/10 bg-[#FAF9F6] p-8 flex flex-col justify-between shrink-0 hidden lg:flex overflow-y-auto">
      <div className="flex flex-col gap-8">
        {/* Official Brand Badge Card */}
        <div className="bg-black text-white p-5 rounded-xl border border-black shadow-lg relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <SnapGridLogo variant="icon" theme="dark" size={32} />
            <div>
              <h5 className="font-sans text-xs font-black tracking-[0.2em] uppercase text-white">
                SNAP GRID
              </h5>
              <p className="font-sans text-[9px] uppercase tracking-widest text-white/50">
                Verified Platform
              </p>
            </div>
          </div>
          <p className="font-serif-editorial text-xs italic text-white/80 leading-relaxed mb-3">
            Visual storytelling, minimalist curation, and high-fidelity photography.
          </p>
          <button
            onClick={onOpenStudio}
            className="w-full py-2 bg-white text-black text-[10px] font-sans uppercase font-bold tracking-widest hover:bg-neutral-200 transition-colors rounded-lg flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            <span>Open Studio</span>
          </button>
        </div>

        {/* Activity Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.3em] font-bold opacity-50">
              Live Activity
            </h4>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          </div>

          <div className="flex flex-col gap-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex gap-3.5 items-start text-xs font-sans">
                <div className="w-2 h-2 rounded-full bg-[#1A1A1A] mt-1.5 shrink-0" />
                <div className="flex-1 leading-relaxed text-[#1A1A1A]">
                  <strong className="font-semibold">@{notif.username}</strong>{' '}
                  {notif.type === 'like' && 'appreciated your publication.'}
                  {notif.type === 'comment' && `commented: "${notif.commentText || 'Superb composition'}"`}
                  {notif.type === 'follow' && 'began following your curation archive.'}
                  <div className="text-[10px] text-[#1A1A1A]/40 mt-0.5">{notif.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Trends */}
        <section className="pt-6 border-t border-[#1A1A1A]/10">
          <div className="flex items-center gap-1.5 mb-4">
            <TrendingUp className="w-3.5 h-3.5 opacity-40" />
            <h4 className="font-sans text-[11px] uppercase tracking-[0.3em] font-bold opacity-50">
              Curator Topics
            </h4>
          </div>

          <div className="flex flex-col gap-2">
            {trends.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                className="text-left text-base font-serif-editorial italic text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:translate-x-1 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Analytics & Storage Card */}
      <div className="p-5 bg-white border border-[#1A1A1A]/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-2">
          <p className="font-sans text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">
            Curator Vault
          </p>
          <HardDrive className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
        </div>

        <div className="w-full h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden mb-2">
          <div className="w-[64%] h-full bg-[#1A1A1A]" />
        </div>

        <div className="flex justify-between font-sans text-[9px] text-[#1A1A1A]/50 uppercase tracking-wider mb-3">
          <span>12.4 GB Used</span>
          <span>64% Allocation</span>
        </div>

        <div className="pt-3 border-t border-[#1A1A1A]/5 flex items-center justify-between text-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider opacity-60">Total Reach</span>
          <span className="font-serif-editorial text-base font-semibold">{totalInteractions.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
};
