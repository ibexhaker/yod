import React from 'react';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  LogOut,
  Clapperboard,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { SnapGridLogo } from './SnapGridLogo';
import { sound } from '../utils/audio';

interface NavigationRailProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  unreadMessagesCount: number;
  unreadNotifsCount: number;
  isMobileSimMode: boolean;
  setIsMobileSimMode: (val: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
  onOpenOmni?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  setActiveTab,
  user,
  unreadMessagesCount,
  unreadNotifsCount,
  isMobileSimMode,
  setIsMobileSimMode,
  soundEnabled,
  onToggleSound,
  onLogout,
  onOpenOmni,
}) => {
  return (
    <nav className="w-20 md:w-24 border-r border-[#1A1A1A]/10 bg-[#FDFCFB] flex flex-col items-center py-6 justify-between shrink-0 select-none z-30">
      {/* Top Logo Mark */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => {
            sound.playPop();
            setActiveTab('feed');
          }}
          className="p-1 rounded-xl bg-black text-white shadow-md hover:scale-110 transition-transform duration-200"
          title="Snap Grid Curator Home"
        >
          <SnapGridLogo variant="icon" theme="dark" size={32} />
        </button>

        {/* Vertical Text Links */}
        <div className="flex flex-col items-center gap-6 pt-2">
          <div className="w-[1px] h-6 bg-[#1A1A1A]/20 mx-auto" />

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('feed');
            }}
            className={`[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.25em] text-[10px] font-sans font-bold transition-all py-1 ${
              activeTab === 'feed'
                ? 'opacity-100 text-[#1A1A1A] font-extrabold scale-105'
                : 'opacity-40 hover:opacity-80 text-[#1A1A1A]'
            }`}
          >
            The Feed
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('explore');
            }}
            className={`[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.25em] text-[10px] font-sans font-bold transition-all py-1 ${
              activeTab === 'explore'
                ? 'opacity-100 text-[#1A1A1A] font-extrabold scale-105'
                : 'opacity-40 hover:opacity-80 text-[#1A1A1A]'
            }`}
          >
            Curate
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('reels');
            }}
            className={`[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.25em] text-[10px] font-sans font-bold transition-all py-1 flex items-center gap-1 ${
              activeTab === 'reels'
                ? 'opacity-100 text-[#1A1A1A] font-extrabold scale-105'
                : 'opacity-40 hover:opacity-80 text-[#1A1A1A]'
            }`}
          >
            Snaps
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('studio');
            }}
            className={`[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.25em] text-[10px] font-sans font-bold transition-all py-1 ${
              activeTab === 'studio'
                ? 'opacity-100 text-[#1A1A1A] font-extrabold scale-105'
                : 'opacity-40 hover:opacity-80 text-[#1A1A1A]'
            }`}
          >
            Studio
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('messages');
            }}
            className={`relative [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.25em] text-[10px] font-sans font-bold transition-all py-1 ${
              activeTab === 'messages'
                ? 'opacity-100 text-[#1A1A1A] font-extrabold scale-105'
                : 'opacity-40 hover:opacity-80 text-[#1A1A1A]'
            }`}
            title="Chat with friends & view letters"
          >
            Chat
            {unreadMessagesCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ed4956] absolute -top-1 right-0" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('activity');
            }}
            className={`relative [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.25em] text-[10px] font-sans font-bold transition-all py-1 ${
              activeTab === 'activity'
                ? 'opacity-100 text-[#1A1A1A] font-extrabold scale-105'
                : 'opacity-40 hover:opacity-80 text-[#1A1A1A]'
            }`}
          >
            Digest
            {unreadNotifsCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] absolute -top-1 right-0" />
            )}
          </button>

          {onOpenOmni && (
            <button
              onClick={() => {
                sound.playPop();
                onOpenOmni();
              }}
              className="[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.25em] text-[10px] font-sans font-bold transition-all py-1 flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:scale-105"
              title="Ask Omni - Intelligent AI Assistant"
            >
              <Sparkles className="w-2.5 h-2.5 text-cyan-400 rotate-90 animate-pulse" />
              <span>Omni</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Profile, Audio & Account Actions */}
      <div className="flex flex-col items-center gap-3">
        {/* Sound toggle button */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-full border transition-all ${
            soundEnabled
              ? 'bg-neutral-100 border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-neutral-200'
              : 'bg-white border-[#1A1A1A]/15 text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
          }`}
          title={soundEnabled ? 'Haptic Soundscapes: ON' : 'Haptic Soundscapes: OFF'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Toggle between Desktop Studio View and Phone Mockup View */}
        <button
          onClick={() => setIsMobileSimMode(!isMobileSimMode)}
          className={`p-2 rounded-full border transition-colors ${
            isMobileSimMode
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-white border-[#1A1A1A]/15 text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
          }`}
          title={isMobileSimMode ? 'Switch to Fullstage Workspace' : 'Switch to Mobile Frame Prototype'}
        >
          {isMobileSimMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
        </button>

        {/* User avatar button */}
        <button
          onClick={() => {
            sound.playPop();
            setActiveTab('profile');
          }}
          className={`w-9 h-9 rounded-full border p-[2px] transition-all relative ${
            activeTab === 'profile'
              ? 'border-[#1A1A1A] ring-2 ring-[#1A1A1A]/20 scale-105'
              : 'border-[#1A1A1A]/20 hover:border-[#1A1A1A]'
          }`}
          title={`Logged in as @${user.username} - View Profile`}
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-full h-full rounded-full object-cover"
          />
        </button>

        {/* Logout / Switch Account button */}
        <button
          onClick={onLogout}
          className="p-1.5 rounded-full text-[#1A1A1A]/40 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Switch Account or Log Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};
