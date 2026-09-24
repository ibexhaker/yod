import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Music,
  Volume2,
  VolumeX,
  CheckCircle2,
  X,
  Sparkles,
  Grid,
  Share2,
  Check,
  UserPlus,
} from 'lucide-react';
import { ReelItem, Conversation } from '../types';
import { sound } from '../utils/audio';

interface ReelsViewProps {
  reels?: ReelItem[];
  conversations?: Conversation[];
  onSelectUser?: (username: string) => void;
  onSendShortToFriend?: (friendUsername: string, reel: ReelItem, note?: string) => void;
  onNavigateToPosts?: (username: string) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels = [],
  conversations = [],
  onSelectUser,
  onSendShortToFriend,
  onNavigateToPosts,
}) => {
  const [reelList, setReelList] = useState<ReelItem[]>(reels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [shareNote, setShareNote] = useState('');
  const [sentAlert, setSentAlert] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [floatingHeart, setFloatingHeart] = useState(false);

  // Sync if props update
  React.useEffect(() => {
    if (reels.length > 0) {
      setReelList(reels);
    }
  }, [reels]);

  if (reelList.length === 0) {
    return (
      <div className="flex-1 bg-black text-white flex items-center justify-center p-8">
        <p className="font-serif-editorial text-lg italic text-white/60">No Snaps found</p>
      </div>
    );
  }

  const currentReel = reelList[activeIndex] || reelList[0];

  const toggleReelLike = (index: number) => {
    sound.playLikeChime();
    setFloatingHeart(true);
    setTimeout(() => setFloatingHeart(false), 900);

    setReelList((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              isLiked: !r.isLiked,
              likes: r.isLiked ? r.likes - 1 : r.likes + 1,
            }
          : r
      )
    );
  };

  const toggleReelSave = (index: number) => {
    sound.playBookmark();
    setReelList((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, isSaved: !r.isSaved } : r
      )
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    sound.playPop();

    setReelList((prev) =>
      prev.map((r, i) =>
        i === activeIndex
          ? {
              ...r,
              comments: r.comments + 1,
              commentsList: [
                ...(r.commentsList || []),
                { id: String(Date.now()), user: 'you', text: newComment.trim() },
              ],
            }
          : r
      )
    );
    setNewComment('');
  };

  const handleOpenShare = () => {
    sound.playPop();
    setShowShareModal(true);
    if (conversations.length > 0) {
      setSelectedFriend(conversations[0].username);
    }
  };

  const handleSendToFriendSubmit = () => {
    if (!selectedFriend) return;
    sound.playCameraShutter();
    onSendShortToFriend?.(selectedFriend, currentReel, shareNote.trim() || undefined);
    setSentAlert(`Short sent to @${selectedFriend} in chat!`);
    setShowShareModal(false);
    setShareNote('');
    setTimeout(() => setSentAlert(null), 3000);
  };

  const handleWatchUserPosts = () => {
    sound.playPop();
    if (onNavigateToPosts) {
      onNavigateToPosts(currentReel.username);
    } else if (onSelectUser) {
      onSelectUser(currentReel.username);
    }
  };

  return (
    <div className="relative flex-1 bg-black flex flex-col justify-between overflow-hidden pb-16 h-full min-h-[520px]">
      {/* Background Media */}
      <div className="absolute inset-0 bg-neutral-900 select-none">
        <img
          src={currentReel.videoPoster}
          alt={currentReel.caption}
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85" />
      </div>

      {/* Floating center heart on like */}
      {floatingHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="animate-heart-burst bg-white/90 p-5 rounded-full shadow-2xl">
            <Heart className="w-16 h-16 fill-[#ed4956] text-[#ed4956]" />
          </div>
        </div>
      )}

      {/* Sent confirmation notification */}
      {sentAlert && (
        <div className="absolute top-16 inset-x-4 z-40 bg-emerald-600/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-center text-xs font-sans font-bold shadow-lg flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-white" />
          <span>{sentAlert}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-2">
          <span className="font-sans font-black tracking-widest text-xs uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">
            SNAP REELS
          </span>
          <span className="text-[10px] text-white/70">
            {activeIndex + 1} of {reelList.length}
          </span>
        </div>
        <button
          onClick={() => {
            sound.playPop();
            setIsMuted(!isMuted);
          }}
          className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Center Reel Switcher Arrows */}
      <div className="relative z-10 flex justify-between px-3 pointer-events-none">
        <button
          disabled={activeIndex === 0}
          onClick={() => {
            sound.playPop();
            setActiveIndex((prev) => Math.max(0, prev - 1));
          }}
          className="pointer-events-auto text-xs text-white/80 hover:text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full disabled:opacity-0 transition-opacity"
        >
          ▲ Prev
        </button>
        <button
          disabled={activeIndex === reelList.length - 1}
          onClick={() => {
            sound.playPop();
            setActiveIndex((prev) => Math.min(reelList.length - 1, prev + 1));
          }}
          className="pointer-events-auto text-xs text-white/80 hover:text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full disabled:opacity-0 transition-opacity"
        >
          ▼ Next
        </button>
      </div>

      {/* Bottom Info & Right Actions Bar */}
      <div className="relative z-10 p-5 flex items-end justify-between gap-4 text-white">
        {/* Caption & Creator details with click-to-watch-posts */}
        <div className="space-y-2.5 flex-1 max-w-[78%]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div
              onClick={handleWatchUserPosts}
              className="flex items-center gap-2 cursor-pointer group"
              title={`View @${currentReel.username}'s posts and profile`}
            >
              <img
                src={currentReel.userImg}
                alt=""
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60 group-hover:scale-105 transition-transform"
              />
              <span className="text-xs font-bold font-sans group-hover:underline">
                @{currentReel.username}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
            </div>

            {/* Direct button: "Watch creator posts" */}
            <button
              onClick={handleWatchUserPosts}
              className="text-[10px] font-sans font-bold uppercase tracking-wider bg-white/20 hover:bg-white text-white hover:text-black px-2.5 py-1 rounded-full backdrop-blur-md transition-all flex items-center gap-1"
            >
              <Grid className="w-3 h-3" />
              <span>Watch Posts</span>
            </button>
          </div>

          <p className="text-xs text-neutral-100 leading-relaxed drop-shadow font-serif-editorial">
            {currentReel.caption}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-white/80 font-sans">
            <Music className="w-3.5 h-3.5 animate-spin" />
            <span className="truncate">{currentReel.song}</span>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          {/* Like */}
          <button
            onClick={() => toggleReelLike(activeIndex)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="p-2.5 bg-black/40 backdrop-blur-md group-hover:bg-black/60 rounded-full transition-colors">
              <Heart
                className={`w-6 h-6 ${
                  currentReel.isLiked ? 'text-[#ed4956] fill-[#ed4956]' : 'text-white'
                }`}
              />
            </div>
            <span className="text-[10px] font-sans font-bold">
              {currentReel.likes.toLocaleString()}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => {
              sound.playPop();
              setShowComments(!showComments);
            }}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="p-2.5 bg-black/40 backdrop-blur-md group-hover:bg-black/60 rounded-full transition-colors">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-sans font-bold">{currentReel.comments}</span>
          </button>

          {/* Send Short in Chat / Letter to Friend */}
          <button
            onClick={handleOpenShare}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
            title="Send this Short to a Friend in Chat"
          >
            <div className="p-2.5 bg-black/40 backdrop-blur-md group-hover:bg-black/60 rounded-full transition-colors">
              <Send className="w-6 h-6 text-white" />
            </div>
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-white/80">
              Chat
            </span>
          </button>

          {/* Save */}
          <button
            onClick={() => toggleReelSave(activeIndex)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="p-2.5 bg-black/40 backdrop-blur-md group-hover:bg-black/60 rounded-full transition-colors">
              <Bookmark
                className={`w-6 h-6 ${
                  currentReel.isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Send Short to Friend Modal */}
      {showShareModal && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 p-6 flex items-center justify-center">
          <div className="bg-[#FAF9F6] text-[#1A1A1A] w-full max-w-sm rounded-2xl p-5 border border-[#1A1A1A]/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#1A1A1A]" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">
                  Send Short in Chat
                </h4>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full hover:bg-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Short preview pill */}
            <div className="flex items-center gap-3 p-2.5 bg-neutral-100 rounded-xl my-4 border border-[#1A1A1A]/10">
              <img
                src={currentReel.videoPoster}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 truncate">
                <span className="font-sans font-bold text-xs block">
                  @{currentReel.username}'s Short
                </span>
                <span className="font-sans text-[10px] text-neutral-500 truncate block">
                  {currentReel.caption}
                </span>
              </div>
            </div>

            {/* Choose friend to send to */}
            <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-600 block mb-2">
              Select Friend or Conversation:
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto mb-4">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedFriend(c.username)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-colors ${
                    selectedFriend === c.username
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white hover:bg-neutral-100 border-[#1A1A1A]/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={c.userImg}
                      alt={c.username}
                      className="w-7 h-7 rounded-full object-cover border border-[#1A1A1A]/20"
                    />
                    <div>
                      <span className="text-xs font-sans block">{c.fullName}</span>
                      <span className="text-[10px] opacity-70 block font-mono">@{c.username}</span>
                    </div>
                  </div>
                  {c.isFriend && (
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Friend
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Optional note */}
            <input
              type="text"
              placeholder="Add a message note (e.g. check this out!)..."
              value={shareNote}
              onChange={(e) => setShareNote(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-sans mb-4 focus:outline-none focus:border-black"
            />

            <button
              onClick={handleSendToFriendSubmit}
              disabled={!selectedFriend}
              className="w-full bg-black text-white py-2.5 rounded-xl font-sans text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
            >
              <span>Send Short into Letter</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Comments Drawer Modal */}
      {showComments && (
        <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-[#1A1A1A]/95 backdrop-blur-xl border-t border-white/20 p-4 z-40 rounded-t-2xl flex flex-col justify-between text-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-sans text-xs font-bold uppercase tracking-wider">
              Discussions ({currentReel.comments})
            </span>
            <button
              onClick={() => setShowComments(false)}
              className="p-1 rounded-full text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2">
            {(currentReel.commentsList || []).map((c) => (
              <div key={c.id} className="text-xs">
                <span className="font-bold text-white/90 mr-2">@{c.user}</span>
                <span className="text-white/70">{c.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="pt-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Add critique..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-white/10 text-white placeholder-white/50 text-xs px-3 py-2 rounded-full focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-black font-sans font-bold text-xs px-3 py-1 rounded-full uppercase"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
