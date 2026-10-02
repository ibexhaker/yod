import React, { useState } from 'react';
import { UserProfile, Post } from '../types';
import {
  Grid,
  Bookmark,
  Settings,
  Edit3,
  Heart,
  MessageCircle,
  Sparkles,
  Flame,
  Award,
  LogOut,
  Camera,
  ExternalLink,
  UserPlus,
  Check,
  Send,
  Sliders,
  Palette,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { getPhotoFilterStyle, THEMES } from '../utils/theme';
import { AppTheme } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileViewProps {
  user: UserProfile;
  posts: Post[];
  savedPosts: Post[];
  isCurrentUser?: boolean;
  isFriend?: boolean;
  onSelectPost: (post: Post) => void;
  onUpdateBio?: (newBio: string) => void;
  onLogout?: () => void;
  onToggleFriend?: (username: string) => void;
  onStartChat?: (username: string) => void;
  onBackToMyProfile?: () => void;
  onEditPost?: (post: Post) => void;
  onSelectTheme?: (theme: AppTheme) => void;
  currentTheme?: AppTheme;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  posts,
  savedPosts,
  isCurrentUser = true,
  isFriend = false,
  onSelectPost,
  onUpdateBio,
  onLogout,
  onToggleFriend,
  onStartChat,
  onBackToMyProfile,
  onEditPost,
  onSelectTheme,
  currentTheme = 'white-blue',
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);

  const userPosts = posts.filter(
    (p) =>
      p.username.toLowerCase() === user.username.toLowerCase() ||
      p.userId === user.id
  );

  const displayedPosts = activeTab === 'posts' ? userPosts : savedPosts;

  const handleSaveBio = () => {
    sound.playCameraShutter();
    onUpdateBio?.(bioInput);
    setIsEditingBio(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Return button if viewing another person's profile/posts from Shorts */}
      {!isCurrentUser && onBackToMyProfile && (
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
          <button
            onClick={() => {
              sound.playPop();
              onBackToMyProfile();
            }}
            className="text-xs font-sans uppercase font-bold tracking-wider text-[#1A1A1A] hover:underline flex items-center gap-1.5"
          >
            ← Back to My Studio Profile
          </button>
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/50">
            Viewing Curator's Monographs
          </span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 p-6 md:p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          {/* Avatar with Editorial Ring & Level */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#1A1A1A] p-1 bg-white shadow-md">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#1A1A1A] text-white p-2 rounded-full shadow-lg border-2 border-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl md:text-3xl font-serif-editorial font-light text-[#1A1A1A]">
                    {user.fullName}
                  </h2>
                  {user.curatorLevel && (
                    <span className="font-sans text-[10px] uppercase font-bold tracking-widest bg-black text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>{user.curatorLevel}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <p className="font-sans text-xs uppercase tracking-widest text-[#1A1A1A]/60 font-semibold font-mono">
                    @{user.username}
                  </p>
                  {user.streakDays && (
                    <span className="font-sans text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{user.streakDays} Day Streak</span>
                    </span>
                  )}
                  {user.joinedDate && (
                    <span className="font-sans text-[10px] text-[#1A1A1A]/40 uppercase tracking-wider hidden sm:inline">
                      • {user.joinedDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons depending on whether viewing own profile or friend's */}
              <div className="flex items-center gap-2">
                {isCurrentUser ? (
                  <>
                    <button
                      onClick={() => {
                        sound.playPop();
                        setIsEditingBio(!isEditingBio);
                      }}
                      className="bg-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] px-4 py-2 text-xs font-sans uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors rounded-lg shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Bio</span>
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => {
                          sound.playPop();
                          onLogout();
                        }}
                        className="bg-white border border-red-200 hover:bg-red-50 text-red-600 px-3 py-2 text-xs font-sans uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors rounded-lg shadow-sm"
                        title="Switch or Exit Account"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Switch</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {/* Add as friend button */}
                    <button
                      onClick={() => {
                        sound.playLikeChime();
                        onToggleFriend?.(user.username);
                      }}
                      className={`px-4 py-2 text-xs font-sans uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all rounded-lg shadow-sm ${
                        isFriend
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isFriend ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Friend Added</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add Friend</span>
                        </>
                      )}
                    </button>

                    {/* Chat with them button */}
                    <button
                      onClick={() => {
                        sound.playPop();
                        onStartChat?.(user.username);
                      }}
                      className="bg-white border border-[#1A1A1A]/30 hover:border-black text-[#1A1A1A] px-4 py-2 text-xs font-sans uppercase tracking-widest font-bold flex items-center gap-1.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 border-y border-[#1A1A1A]/10 py-3">
              <div>
                <div className="text-lg md:text-xl font-serif-editorial font-light text-[#1A1A1A]">
                  {userPosts.length}
                </div>
                <div className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-50">
                  Publications
                </div>
              </div>
              <div className="w-[1px] h-8 bg-[#1A1A1A]/10" />
              <div>
                <div className="text-lg md:text-xl font-serif-editorial font-light text-[#1A1A1A]">
                  {user.followersCount.toLocaleString()}
                </div>
                <div className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-50">
                  Followers
                </div>
              </div>
              <div className="w-[1px] h-8 bg-[#1A1A1A]/10" />
              <div>
                <div className="text-lg md:text-xl font-serif-editorial font-light text-[#1A1A1A]">
                  {user.followingCount.toLocaleString()}
                </div>
                <div className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-50">
                  Curators Following
                </div>
              </div>
            </div>

            {/* Bio section */}
            {isEditingBio ? (
              <div className="space-y-3 pt-2">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/20 p-3 text-xs font-sans rounded-lg focus:outline-none focus:border-black"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBio}
                    className="bg-black text-white px-4 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="bg-neutral-200 text-black px-4 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-serif-editorial text-sm md:text-base text-[#1A1A1A]/90 italic leading-relaxed">
                  "{user.bio}"
                </p>
                {user.website && (
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs text-[#1A1A1A] font-bold underline flex items-center gap-1 hover:opacity-70"
                  >
                    <span>{user.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {user.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {user.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-sans font-bold uppercase tracking-wider bg-white border border-[#1A1A1A]/10 px-2 py-0.5 rounded-full text-[#1A1A1A]/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Theme Palette Switcher for current user */}
                {isCurrentUser && onSelectTheme && (
                  <div className="pt-3 border-t border-[#1A1A1A]/10 mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-60 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-blue-600" />
                      <span>Snap Grid Theme:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {THEMES.map((th) => {
                        const isCurrent = currentTheme === th.id;
                        return (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => {
                              sound.playPop();
                              onSelectTheme(th.id);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider border transition-all flex items-center gap-1 ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white hover:bg-neutral-50 text-neutral-700 border-black/15'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${th.previewAccent}`} />
                            <span>{th.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PWA Web App Install Card (shown if not yet installed) */}
        {isCurrentUser && (
          <PWAInstallButton variant="card" className="mt-6" />
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-8 border-b border-[#1A1A1A]/10">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-b-2 border-black text-black'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Publications ({userPosts.length})</span>
        </button>

        {isCurrentUser && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-b-2 border-black text-black'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Archives ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Grid of posts */}
      {displayedPosts.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded-2xl">
          <Camera className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="font-serif-editorial text-lg italic text-neutral-500">
            No monographs published yet in this collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                sound.playPop();
                onSelectPost(post);
              }}
              className="group relative aspect-square bg-neutral-100 rounded-xl overflow-hidden border border-black/10 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={post.postImg}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={getPhotoFilterStyle(post.filter, post.filterSettings)}
              />
              {/* Quick Edit Post trigger */}
              {onEditPost && isCurrentUser && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playPop();
                    onEditPost(post);
                  }}
                  className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-white text-black px-2 py-1 rounded-md shadow-md font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 z-10 transition-transform hover:scale-105"
                  title="Edit Filters & Curves"
                >
                  <Sliders className="w-3 h-3 text-blue-600" />
                  <span>Edit</span>
                </button>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-sans text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  {post.comments.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
